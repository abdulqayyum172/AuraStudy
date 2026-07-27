import { Router } from 'express';
import multer from 'multer';
import { VM } from 'vm2';
import { geminiReady, geminiState, GEMINI_MODEL, GEMINI_URL, GEMINI_KEY, STRICT_AI, isGeminiAvailable, fetchWithRetry, callGemini, callGeminiStream } from '../config/gemini.js';
import { KNOWLEDGE_BASE, simulateAIResponse } from '../services/knowledgeBase.js';
import { buildStudentContext } from '../services/studentContext.js';

const router = Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

// ── AI Service Status ────────────────────────────────────────────────────────
// Reports whether the AI backend is live, cooling down, or in error state.
// The frontend polls this endpoint to drive the header status pill.
router.get('/status', (req, res) => {
  const now = Date.now();
  let mode = 'live';
  if (!geminiReady) {
    mode = 'unconfigured';
  } else if (geminiState.status === 'cooling_down' && now < geminiState.cooldownUntil) {
    mode = 'cooling_down';
  } else if (geminiState.status === 'error') {
    mode = 'error';
  }
  res.json({
    mode,
    model: GEMINI_MODEL,
    strictAi: STRICT_AI,
    reason: geminiState.reason,
    cooldownRemainingMs: Math.max(0, geminiState.cooldownUntil - now),
    lastSuccessAt: geminiState.lastSuccessAt || null,
    lastError: geminiState.lastError || null,
  });
});

// Chat — SSE streaming endpoint
router.post('/chat', async (req, res) => {
  const { message, history, classLevel, course, stream, department, image } = req.body;
  if (!message) return res.status(400).json({ error: 'Message is required' });

  const context = buildStudentContext(classLevel, course, stream, department);

  // Build image parts for Gemini vision if an image was uploaded
  let imageParts = null;
  if (image && image.base64 && image.mimeType) {
    imageParts = [{ inlineData: { mimeType: image.mimeType, data: image.base64 } }];
  }

  // Set up SSE headers
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no');
  res.flushHeaders();

  // Send initial event to indicate streaming started
  res.write(`data: ${JSON.stringify({ type: 'start' })}\n\n`);

  if (isGeminiAvailable()) {
    try {
      let fullReply = '';
      for await (const chunk of callGeminiStream(message, history || [], context, imageParts)) {
        fullReply += chunk;
        res.write(`data: ${JSON.stringify({ type: 'chunk', text: chunk })}\n\n`);
      }
      if (fullReply) {
        res.write(`data: ${JSON.stringify({ type: 'done', reply: fullReply, isSimulated: false })}\n\n`);
        return res.end();
      }
    } catch (error) {
      console.error('Gemini API Chat Stream Error:', error.message);
    }

    // Fallback: try non-streaming Gemini call
    try {
      const reply = await callGemini(imageParts ? message + '\n\n[User has uploaded an image for you to analyze]' : message, history || [], context);
      res.write(`data: ${JSON.stringify({ type: 'done', reply, isSimulated: false })}\n\n`);
      return res.end();
    } catch (error) {
      console.error('Gemini API Chat Fallback Error:', error.message);
    }
  }

  // Knowledge engine fallback — include image context in message for smarter matching
  if (STRICT_AI) {
    console.error('🛑 [STRICT_AI] /api/ai/chat — Gemini unavailable, returning 502');
    res.write(`data: ${JSON.stringify({ type: 'error', error: 'AI service unavailable. Gemini API is not responding (likely quota or model issue). Set STRICT_AI=false in backend/.env to enable offline fallback.' })}\n\n`);
    return res.end();
  }
  const searchQuery = image ? message + ' image photo picture' : message;
  const reply = simulateAIResponse('chat', searchQuery, history, { classLevel, course, stream, department });
  const imageNote = image ? '\n\n---\n*📎 Image uploaded. For full image analysis (OCR, diagram reading, etc.), the Gemini API quota needs to be refreshed.*' : '';
  res.write(`data: ${JSON.stringify({ type: 'done', reply: reply + imageNote, isSimulated: true })}\n\n`);
  res.end();
});

// Summarize Notes
router.post('/summarize', async (req, res) => {
  const { content, classLevel, course, stream, department } = req.body;
  if (!content) return res.status(400).json({ error: 'Content is required' });

  const context = buildStudentContext(classLevel, course, stream, department);

  if (isGeminiAvailable()) {
    try {
      const prompt = `You are summarizing the following student notes. Create a clear, well-structured study summary using this format:

## Key Concepts
- List the main ideas as concise bullet points with **bold** key terms

## Important Details
- Include critical facts, formulas, or definitions the student must remember

## Study Tips
- 2-3 specific suggestions for how to review and remember this material

If the notes contain formulas, theorems, or technical processes, preserve them exactly. Keep the summary concise but comprehensive enough to replace re-reading the full notes.

---

NOTES:
${content}`;
      const text = await callGemini(prompt, [], context);
      return res.json({ summary: text, isSimulated: false });
    } catch (error) {
      console.error('Gemini API Summarize Error:', error.message);
    }
  }

  if (STRICT_AI) {
    console.error('🛑 [STRICT_AI] /api/ai/summarize — Gemini unavailable, returning 502');
    return res.status(502).json({
      error: 'AI service unavailable. Gemini API is not responding (likely quota or model issue). Set STRICT_AI=false in backend/.env to enable offline fallback.',
      isSimulated: false
    });
  }
  const summary = simulateAIResponse('summarize', content, [], { classLevel, course, stream, department });
  res.json({ summary, isSimulated: true });
});

// Generate Flashcards
router.post('/generate-cards', async (req, res) => {
  const { content, classLevel, course, stream, department } = req.body;
  if (!content) return res.status(400).json({ error: 'Content is required' });

  const context = buildStudentContext(classLevel, course, stream, department);

  if (isGeminiAvailable()) {
    try {
      const contextNote = context ? `\nSTUDENT LEVEL: ${context.trim()}\nTailor flashcard difficulty and terminology to this student's level.\n` : '';
      const prompt = `Generate high-quality study flashcards from the following notes. Requirements:
- Create 3-7 flashcards (more for longer content)
- Each question should test understanding, NOT just recall — ask "why", "how", or "explain" when possible
- Answers should be concise but complete (1-3 sentences max)
- Cover the most important concepts, NOT minor details
- For math/science: questions about formulas, processes, or problem-solving steps
- For humanities: questions about key themes, arguments, or cause-effect relationships
${contextNote}
Return ONLY a raw JSON array. No markdown. No code fences. Just the array:
[{"question": "...", "answer": "..."}]

---
NOTES:
${content}`;

      // Direct API call — simple request
      const body = {
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        systemInstruction: { parts: [{ text: 'You are an expert study flashcard generator. Always return valid JSON arrays only, no extra text.' }] },
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 16384,
        }
      };

      const response = await fetchWithRetry(`${GEMINI_URL}?key=${GEMINI_KEY}`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'X-goog-api-key': GEMINI_KEY
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errBody = await response.text();
        throw new Error(`Gemini API ${response.status}: ${errBody}`);
      }

      const data = await response.json();
      const rawText = data?.candidates?.[0]?.content?.parts
        ?.filter(p => p.text && !p.thought)
        ?.map(p => p.text)
        ?.join('');

      if (!rawText) throw new Error('Empty response from Gemini API');

      const cleanJsonStr = rawText
        .replace(/^```(?:json)?\s*/i, '')
        .replace(/```\s*$/m, '')
        .trim();

      const jsonMatch = cleanJsonStr.match(/\[[\s\S]*\]/);
      const jsonStr = jsonMatch ? jsonMatch[0] : cleanJsonStr;

      const flashcards = JSON.parse(jsonStr);
      if (Array.isArray(flashcards) && flashcards.length > 0) {
        return res.json({ flashcards, isSimulated: false });
      }
    } catch (error) {
      console.error('Gemini API Generate Cards Error:', error.message);
    }
  }

  if (STRICT_AI) {
    console.error('🛑 [STRICT_AI] /api/ai/generate-cards — Gemini unavailable, returning 502');
    return res.status(502).json({
      error: 'AI service unavailable. Gemini API is not responding (likely quota or model issue). Set STRICT_AI=false in backend/.env to enable offline fallback.',
      isSimulated: false
    });
  }
  const flashcards = simulateAIResponse('generate-cards', content, [], { classLevel, course, stream, department });
  res.json({ flashcards, isSimulated: true });
});

// Generate Quiz
router.post('/generate-quiz', async (req, res) => {
  const { content, classLevel, course, stream, department, questionCount } = req.body;
  if (!content) return res.status(400).json({ error: 'Content is required' });

  const context = buildStudentContext(classLevel, course, stream, department);
  const numQuestions = Math.min(Math.max(parseInt(questionCount) || 5, 1), 20);
  const difficulty = (req.body.difficulty || 'Medium').toLowerCase();

  if (isGeminiAvailable()) {
    try {
      const askFor = Math.min(numQuestions + 5, 25);
      const contextNote = context ? `\nSTUDENT LEVEL: ${context.trim()}\nMake questions appropriate for this student's level.\n` : '';
      const prompt = `Generate EXACTLY ${askFor} multiple-choice quiz questions about the topic below. The questions must be directly and specifically about this topic. Do NOT generate fewer than ${askFor} questions.

TOPIC: ${content}
${contextNote}
Difficulty: ${difficulty}
${difficulty === 'easy' ? 'Focus on definitions, basic facts, and simple recall.' : difficulty === 'hard' ? 'Focus on analysis, application, and complex reasoning. Real-world problem solving.' : 'Mix: some recall, some application, some analysis.'}

FORMAT REQUIREMENTS:
- Return ONLY a JSON array — no text before or after
- No markdown, no code fences
- Each question has 4 options (A, B, C, D), exactly ONE correct
- The "correct" field must be exactly one uppercase letter: "A", "B", "C", or "D"
- Include a short explanation for the correct answer
- Questions must be SPECIFIC to the topic "${content}" — not generic
- You MUST return ALL ${askFor} questions in the array

Example format:
[{"question":"What is X?","options":{"A":"...","B":"...","C":"...","D":"..."},"correct":"A","explanation":"Because..."},{"question":"What is Y?","options":{"A":"...","B":"...","C":"...","D":"..."},"correct":"B","explanation":"Because..."}]`;

      const body = {
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        systemInstruction: { parts: [{ text: 'You are an expert quiz question generator. Always return valid JSON arrays only, no extra text.' }] },
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 16384,
        }
      };

      console.log(`[Quiz] Generating ${numQuestions} questions about "${content}" (${difficulty}) via ${GEMINI_MODEL}`);
      const response = await fetchWithRetry(`${GEMINI_URL}?key=${GEMINI_KEY}`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'X-goog-api-key': GEMINI_KEY
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errBody = await response.text();
        throw new Error(`Gemini API ${response.status}: ${errBody}`);
      }

      const data = await response.json();
      const rawText = data?.candidates?.[0]?.content?.parts
        ?.filter(p => p.text && !p.thought)
        ?.map(p => p.text)
        ?.join('');

      if (!rawText) throw new Error('Empty response from Gemini API');
      console.log(`[Quiz] Gemini responded (${rawText.length} chars)`);

      // Strip markdown code fences if present
      let cleanJsonStr = rawText
        .replace(/^```(?:json)?\s*/i, '')
        .replace(/```\s*$/m, '')
        .trim();

      // Try to extract JSON array — find first '[' and last ']' to get the whole array
      const firstBracket = cleanJsonStr.indexOf('[');
      const lastBracket = cleanJsonStr.lastIndexOf(']');
      if (firstBracket !== -1 && lastBracket > firstBracket) {
        cleanJsonStr = cleanJsonStr.substring(firstBracket, lastBracket + 1);
      }

      const quiz = JSON.parse(cleanJsonStr);
      if (Array.isArray(quiz) && quiz.length > 0) {
        // Validate each question has required fields and normalize correct answer
        const validQuiz = quiz
          .map(q => ({
            ...q,
            correct: typeof q.correct === 'string' ? q.correct.trim().toUpperCase() : q.correct
          }))
          .filter(q =>
            q.question && q.options && q.correct &&
            ['A', 'B', 'C', 'D'].includes(q.correct) &&
            q.options.A && q.options.B && q.options.C && q.options.D
          );
        if (validQuiz.length >= numQuestions) {
          console.log(`[Quiz] Parsed ${validQuiz.length} valid questions (requested ${numQuestions})`);
          return res.json({ quiz: validQuiz.slice(0, numQuestions), isSimulated: false });
        }
      }
    } catch (error) {
      console.error('[Quiz] Gemini error:', error.message);
    }
  }

  // Fallback: generate proper multiple-choice questions from knowledge base or user text
  const lowerContent = content.toLowerCase();
  const matchedTopics = KNOWLEDGE_BASE.filter(entry =>
    entry.keywords.some(k => lowerContent.includes(k))
  );

  const fallbackQuiz = [];

  // Helper to extract facts from markdown text
  const extractFactsFromKB = (answerText) => {
    const facts = [];
    const lines = answerText.split('\n');
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#') || trimmed.startsWith('```')) continue;
      
      let cleanFact = trimmed;
      if (trimmed.startsWith('-') || trimmed.startsWith('*') || trimmed.startsWith('•')) {
        cleanFact = trimmed.replace(/^[-*•]\s*/, '');
      } else if (/^\d+\.\s*/.test(trimmed)) {
        cleanFact = trimmed.replace(/^\d+\.\s*/, '');
      }
      
      cleanFact = cleanFact.replace(/\*/g, '').trim();
      
      if (cleanFact.length > 25 && cleanFact.length < 200) {
        facts.push(cleanFact);
      }
    }
    return [...new Set(facts)];
  };

  // Helper to get category-based distractors
  const getCategoryDistractors = (keywords) => {
    const programmingKeywords = ['html', 'css', 'javascript', 'js', 'react', 'python', 'node', 'sql', 'git', 'programming', 'code', 'database'];
    const scienceKeywords = ['photosynthesis', 'plant', 'chlorophyll', 'biology', 'science', 'chemistry', 'physics', 'atom', 'gravity', 'cell'];
    
    const isProg = keywords.some(k => programmingKeywords.some(pk => k.toLowerCase().includes(pk)));
    const isSci = keywords.some(k => scienceKeywords.some(sk => k.toLowerCase().includes(sk)));
    
    if (isProg) {
      return [
        `It is a deprecated feature in legacy web standards.`,
        `It requires compiling the code to low-level assembly.`,
        `It is a proprietary protocol owned by Microsoft.`,
        `It only runs on server-side environments using Python.`,
        `It is an encrypted database storage query command.`,
        `It requires manually managing memory allocation and garbage collection.`,
        `It was replaced by modern CSS Grid and Flexbox layouts.`
      ];
    } else if (isSci) {
      return [
        `It was disproven by modern quantum physics experiments.`,
        `It only occurs under extreme high-pressure deep sea conditions.`,
        `It is a process exclusive to volcanic thermal vents.`,
        `It is a theoretical model with no experimental validation.`,
        `It is governed entirely by gravitational wave interactions.`,
        `It happens only in absolute zero temperatures in vacuum.`,
        `It is a chemical reaction that consumes oxygen to produce neon.`
      ];
    } else {
      return [
        `It was established by the 1921 International Accord.`,
        `It is a common misconception with no scientific basis.`,
        `It is a statistical calculation method used in finance.`,
        `It only applies to historical ancient civilizations.`,
        `It is a deprecated technique no longer in use.`,
        `It is purely a theoretical exercise with no practical uses.`
      ];
    }
  };

  // Helper to generate a question from a fact
  const generateQuestionFromFact = (fact, topicName, categoryDistractors, index) => {
    const templates = [
      `Regarding ${topicName}, which of the following is correct?`,
      `According to the study material, which statement is true about ${topicName}?`,
      `Which of the following best describes a key aspect of ${topicName}?`,
      `When studying ${topicName}, which of the following is a factual statement?`,
      `Which of the following is accurate concerning ${topicName}?`
    ];
    
    const questionText = templates[index % templates.length];
    
    const shuffledDistractors = [...categoryDistractors].sort(() => 0.5 - Math.random());
    const selectedDistractors = shuffledDistractors.slice(0, 3);
    
    const items = [
      { text: fact, isCorrect: true },
      ...selectedDistractors.map(d => ({ text: d, isCorrect: false }))
    ];
    
    items.sort(() => 0.5 - Math.random());
    
    const options = {
      A: items[0].text,
      B: items[1].text,
      C: items[2].text,
      D: items[3].text
    };
    
    const correctIndex = items.findIndex(item => item.isCorrect);
    const correctLetter = ['A', 'B', 'C', 'D'][correctIndex];
    
    return {
      question: questionText,
      options,
      correct: correctLetter,
      explanation: `Fact from study topic: "${fact}"`
    };
  };

  if (matchedTopics.length > 0) {
    // Build a pool of topic-based questions with real distractors
    for (const entry of matchedTopics) {
      const topicName = entry.keywords[0].charAt(0).toUpperCase() + entry.keywords[0].slice(1);
      const facts = extractFactsFromKB(entry.answer);
      const distractors = getCategoryDistractors(entry.keywords);
      
      // Shuffle facts to keep quizzes fresh
      facts.sort(() => 0.5 - Math.random());
      
      for (let i = 0; i < facts.length && fallbackQuiz.length < numQuestions; i++) {
        fallbackQuiz.push(generateQuestionFromFact(facts[i], topicName, distractors, i));
      }
    }
  }

  // Dynamic text question generator fallback if user pasted text
  if (fallbackQuiz.length < numQuestions && content.length > 10) {
    const sentences = content.split(/[.!?\n]+/).map(s => s.trim()).filter(s => s.length > 20);
    const topicTitle = content.split('\n')[0].replace(/[#*_-]/g, '').trim().substring(0, 40) || 'the study material';
    
    const shuffledSentences = [...sentences].sort(() => 0.5 - Math.random());
    const distractors = getCategoryDistractors([topicTitle]);
    
    for (let i = 0; i < shuffledSentences.length && fallbackQuiz.length < numQuestions; i++) {
      const sentence = shuffledSentences[i];
      
      const items = [
        { text: sentence.length > 120 ? sentence.slice(0, 117) + '...' : sentence, isCorrect: true },
        ...distractors.slice(0, 3).map(d => ({ text: d, isCorrect: false }))
      ];
      items.sort(() => 0.5 - Math.random());
      
      const options = {
        A: items[0].text,
        B: items[1].text,
        C: items[2].text,
        D: items[3].text
      };
      
      const correctIndex = items.findIndex(item => item.isCorrect);
      const correctLetter = ['A', 'B', 'C', 'D'][correctIndex];
      
      fallbackQuiz.push({
        question: `According to the material on ${topicTitle}, which statement is accurate?`,
        options,
        correct: correctLetter,
        explanation: `As stated in your study notes: "${sentence}"`
      });
    }
  }

  // TOP-UP LOOP: Guarantee exact requested question count (3, 5, 10, 15, 20)
  const cleanTopicTitle = content.trim().replace(/[#*_-]/g, '').split('\n')[0] || 'the study topic';
  
  const topUpTemplates = [
    {
      question: `Which statement best describes the fundamental principle of ${cleanTopicTitle}?`,
      correct: `It establishes core rules, structures, and practical methods for solving problems in ${cleanTopicTitle}.`,
      distractors: [
        `It is an obsolete concept with no practical application in modern times.`,
        `It only applies in theoretical situations with no real-world evidence.`,
        `It requires memorization without any logical or systematic rules.`
      ],
      explanation: `Mastering ${cleanTopicTitle} involves understanding its core rules, structural elements, and practical problem-solving methods.`
    },
    {
      question: `When approaching a complex problem involving ${cleanTopicTitle}, what is the recommended strategy?`,
      correct: `Break the problem into key components, identify target variables, and apply systematic rules.`,
      distractors: [
        `Guess the answer immediately without reviewing given facts.`,
        `Ignore standard formulas and create non-standard definitions.`,
        `Skip intermediate verification steps to save time.`
      ],
      explanation: `Effective study and problem solving in ${cleanTopicTitle} requires breaking complex topics into structured, manageable steps.`
    },
    {
      question: `Which effective learning method is best suited for mastering ${cleanTopicTitle}?`,
      correct: `Active recall, practice problem solving, and self-testing.`,
      distractors: [
        `Passive reading right before examinations.`,
        `Avoiding active practice and relying on instinct.`,
        `Memorizing answers without understanding underlying concepts.`
      ],
      explanation: `Active recall and self-testing build durable memory and deep understanding of ${cleanTopicTitle}.`
    },
    {
      question: `What is a common error students make when studying ${cleanTopicTitle}?`,
      correct: `Confusing similar terms or skipping step-by-step verification.`,
      distractors: [
        `Practicing too many step-by-step example problems.`,
        `Verifying units and intermediate calculations.`,
        `Connecting concepts to real-world applications.`
      ],
      explanation: `Common mistakes in ${cleanTopicTitle} often stem from confusing closely related terminology or rushing through steps without verification.`
    },
    {
      question: `How does a strong foundation in ${cleanTopicTitle} benefit advanced study?`,
      correct: `It provides prerequisite knowledge and analytical skills for higher-level topics.`,
      distractors: [
        `It is completely disconnected from future learning.`,
        `It eliminates the need for further study in the discipline.`,
        `It only applies to basic introductory tests.`
      ],
      explanation: `Foundational mastery of ${cleanTopicTitle} prepares you for more complex subjects and advanced academic challenges.`
    },
    {
      question: `What is the primary objective of studying and applying ${cleanTopicTitle}?`,
      correct: `To develop systematic analytical skills and apply structured solutions to related problems.`,
      distractors: [
        `To memorize facts without understanding their relationships.`,
        `To replace creative thinking with rigid, automatic algorithms.`,
        `To study concepts that are entirely isolated from other academic subjects.`
      ],
      explanation: `The goal of studying ${cleanTopicTitle} is to build structured reasoning capabilities and apply them to problem solving.`
    },
    {
      question: `Which of the following highlights the practical value of mastering ${cleanTopicTitle}?`,
      correct: `It enables more efficient reasoning and accurate decision-making in the field.`,
      distractors: [
        `It guarantees immediate career advancement without additional experience.`,
        `It simplifies all tasks so that no effort is required.`,
        `It is strictly a theoretical exercise with no practical uses.`
      ],
      explanation: `Mastering ${cleanTopicTitle} is highly practical as it enhances reasoning, analysis, and problem-solving efficiency.`
    },
    {
      question: `How should new concepts in ${cleanTopicTitle} be integrated during study?`,
      correct: `By connecting them to existing knowledge and explaining them in your own words.`,
      distractors: [
        `By keeping them separate to avoid confusion.`,
        `By focusing only on memorizing the exact phrasing of definitions.`,
        `By assuming they are unrelated to previously learned topics.`
      ],
      explanation: `Integrating new topics in ${cleanTopicTitle} with what you already know strengthens conceptual retention.`
    },
    {
      question: `What role does critical thinking play in understanding ${cleanTopicTitle}?`,
      correct: `It helps evaluate evidence, identify underlying assumptions, and verify conclusions.`,
      distractors: [
        `It is unnecessary since memorization is sufficient.`,
        `It slows down learning and should be avoided during exams.`,
        `It is only useful for advanced researchers, not regular students.`
      ],
      explanation: `Critical thinking enables a deeper grasp of ${cleanTopicTitle} by looking beyond surface-level facts.`
    },
    {
      question: `Why is consistent practice highly recommended for topics like ${cleanTopicTitle}?`,
      correct: `It reinforces memory pathways and increases fluency in applying the concepts.`,
      distractors: [
        `It is the only way to pass without understanding the material.`,
        `It guarantees that you will never make mistakes again.`,
        `It is a waste of time compared to passive reviewing.`
      ],
      explanation: `Consistent practice builds familiarity and speed when working with ${cleanTopicTitle} concepts.`
    }
  ];

  const shuffledTemplates = [...topUpTemplates].sort(() => 0.5 - Math.random());
  let templateIndex = 0;

  while (fallbackQuiz.length < numQuestions) {
    const t = shuffledTemplates[templateIndex % shuffledTemplates.length];
    templateIndex++;

    const items = [
      { text: t.correct, isCorrect: true },
      ...t.distractors.map(d => ({ text: d, isCorrect: false }))
    ];
    items.sort(() => 0.5 - Math.random());

    const options = {
      A: items[0].text,
      B: items[1].text,
      C: items[2].text,
      D: items[3].text
    };

    const correctIndex = items.findIndex(item => item.isCorrect);
    const correctLetter = ['A', 'B', 'C', 'D'][correctIndex];

    fallbackQuiz.push({
      question: t.question,
      options,
      correct: correctLetter,
      explanation: t.explanation
    });
  }

  if (STRICT_AI) {
    console.error('🛑 [STRICT_AI] /api/ai/generate-quiz — Gemini unavailable, returning 502');
    return res.status(502).json({
      error: 'AI service unavailable. Gemini API is not responding (likely quota or model issue). Set STRICT_AI=false in backend/.env to enable offline fallback.',
      isSimulated: false
    });
  }

  return res.json({
    quiz: fallbackQuiz.slice(0, numQuestions),
    isSimulated: true,
    message: `Generated ${fallbackQuiz.length} questions for "${cleanTopicTitle}".`
  });
});

// Explain concept
router.post('/explain', async (req, res) => {
  const { concept, classLevel, course, stream, department } = req.body;
  if (!concept) return res.status(400).json({ error: 'Concept is required' });

  const context = buildStudentContext(classLevel, course, stream, department);

  if (isGeminiAvailable()) {
    try {
      const prompt = `Explain the concept "${concept}" in a way that is clear, thorough, and appropriate for the student's level. Use this structure:

## What is it?
A clear, concise definition in 1-2 sentences.

## How does it work?
A step-by-step or logical explanation. Use examples, analogies, or diagrams (in text form) where helpful.

## Why does it matter?
Real-world applications or why this concept is important in the subject.

## Common mistakes
1-2 common misconceptions or errors students make with this concept.

## Quick check
One self-test question the student can use to verify their understanding.`;
      const text = await callGemini(prompt, [], context);
      return res.json({ explanation: text, isSimulated: false });
    } catch (error) {
      console.error('Gemini API Explain Error:', error.message);
    }
  }

  if (STRICT_AI) {
    console.error('🛑 [STRICT_AI] /api/ai/explain — Gemini unavailable, returning 502');
    return res.status(502).json({
      error: 'AI service unavailable. Gemini API is not responding (likely quota or model issue). Set STRICT_AI=false in backend/.env to enable offline fallback.',
      isSimulated: false
    });
  }
  const explanation = `**${concept}**\n\nI'd love to explain this concept in detail, but the AI engine is currently unavailable. Please try again in a moment.\n\nIn the meantime, try breaking the concept down into: What is it? How is it used? Why is it important?`;
  res.json({ explanation, isSimulated: true });
});

// ── Image Upload for AI Chat ────────────────────────────────────────────────

router.post('/upload', upload.single('image'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  try {
    // Convert buffer to base64 data URL for Gemini vision
    const mimeType = req.file.mimetype;
    const base64 = req.file.buffer.toString('base64');
    const dataUrl = `data:${mimeType};base64,${base64}`;
    res.json({
      success: true,
      image: {
        mimeType,
        base64,
        dataUrl,
        size: req.file.size,
        originalName: req.file.originalname
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── Code Execution (Sandboxed via vm2) ──────────────────────────────────────

router.post('/execute', async (req, res) => {
  const { code, language } = req.body;
  if (!code) return res.status(400).json({ error: 'Code is required' });

  if (language && language !== 'javascript') {
    return res.status(400).json({ error: 'Only JavaScript execution is supported in the sandbox.' });
  }

  try {
    const vm = new VM({
      timeout: 3000,
      sandbox: {
        console: {
          logs: [],
          log(...args) { this.logs.push(args.map(a => typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a)).join(' ')); },
          error(...args) { this.logs.push('[ERROR] ' + args.map(a => typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a)).join(' ')); },
          warn(...args) { this.logs.push('[WARN] ' + args.map(a => typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a)).join(' ')); }
        }
      }
    });

    const wrappedCode = `
      const __output = [];
      const __console = {
        log(...args) { __output.push(args.map(a => typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a)).join(' ')); },
        error(...args) { __output.push('[ERROR] ' + args.map(a => typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a)).join(' ')); },
        warn(...args) { __output.push('[WARN] ' + args.map(a => typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a)).join(' ')); },
        info(...args) { __output.push(args.map(a => typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a)).join(' ')); }
      };
      console = __console;
      ${code}
      JSON.stringify(__output);
    `;

    const result = vm.run(wrappedCode);
    const output = JSON.parse(result || '[]');

    res.json({
      success: true,
      output: output.join('\n'),
      logs: output
    });
  } catch (err) {
    const errMsg = err.message || String(err);
    res.json({
      success: false,
      error: errMsg,
      output: `[Execution Error] ${errMsg}`
    });
  }
});

export default router;
