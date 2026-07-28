import { Router } from 'express';
import multer from 'multer';
import { VM } from 'vm2';
import { GEMINI_MODEL, GEMINI_URL, GEMINI_KEY, GEMINI_STREAM_URL, SYSTEM_INSTRUCTION } from '../config/gemini.js';
import { buildStudentContext } from '../services/studentContext.js';
import { simulateAIResponse } from '../services/knowledgeBase.js';

const router = Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

// ── Helper: Call Gemini API (non-streaming) ───────────────────────────────────
async function askGemini(prompt, systemPrompt = SYSTEM_INSTRUCTION, temperature = 0.7) {
  if (!GEMINI_KEY) throw new Error('GEMINI_API_KEY is not configured on the server.');

  const body = {
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    systemInstruction: { parts: [{ text: systemPrompt }] },
    generationConfig: { temperature, maxOutputTokens: 8192 },
  };

  const res = await fetch(`${GEMINI_URL}?key=${GEMINI_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Gemini API error ${res.status}: ${errText}`);
  }

  const data = await res.json();
  const text = data?.candidates?.[0]?.content?.parts
    ?.filter(p => p.text && !p.thought)
    ?.map(p => p.text)
    ?.join('');

  if (!text) throw new Error('Gemini returned an empty response.');
  return text;
}

// ── Helper: Call Gemini with conversation history ────────────────────────────
async function askGeminiWithHistory(userMessage, history = [], systemPrompt = SYSTEM_INSTRUCTION, imageParts = null) {
  if (!GEMINI_KEY) throw new Error('GEMINI_API_KEY is not configured on the server.');

  const contents = [];

  // Add conversation history
  const cleanHistory = (history || []).filter(
    h => h && h.content && typeof h.content === 'string' && h.content.trim().length > 0
  );
  for (const h of cleanHistory) {
    const role = (h.role === 'assistant' || h.role === 'model') ? 'model' : 'user';
    if (contents.length === 0 && role === 'model') continue;
    if (contents.length > 0 && contents[contents.length - 1].role === role) {
      contents[contents.length - 1].parts[0].text += '\n\n' + h.content;
    } else {
      contents.push({ role, parts: [{ text: h.content }] });
    }
  }

  // Add current user message
  const userParts = imageParts && imageParts.length > 0
    ? [...imageParts, { text: userMessage }]
    : [{ text: userMessage }];

  if (contents.length > 0 && contents[contents.length - 1].role === 'user') {
    contents[contents.length - 1].parts[0].text += '\n\n' + userMessage;
  } else {
    contents.push({ role: 'user', parts: userParts });
  }

  const body = {
    contents,
    systemInstruction: { parts: [{ text: systemPrompt }] },
    generationConfig: { temperature: 0.7, maxOutputTokens: 8192 },
  };

  const res = await fetch(`${GEMINI_URL}?key=${GEMINI_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Gemini API error ${res.status}: ${errText}`);
  }

  const data = await res.json();
  const text = data?.candidates?.[0]?.content?.parts
    ?.filter(p => p.text && !p.thought)
    ?.map(p => p.text)
    ?.join('');

  if (!text) throw new Error('Gemini returned an empty response.');
  return text;
}

// ── Helper: Stream from Gemini API ───────────────────────────────────────────
async function* streamGemini(userMessage, history = [], systemPrompt = SYSTEM_INSTRUCTION, imageParts = null) {
  if (!GEMINI_KEY) throw new Error('GEMINI_API_KEY is not configured on the server.');

  const contents = [];
  const cleanHistory = (history || []).filter(
    h => h && h.content && typeof h.content === 'string' && h.content.trim().length > 0
  );
  for (const h of cleanHistory) {
    const role = (h.role === 'assistant' || h.role === 'model') ? 'model' : 'user';
    if (contents.length === 0 && role === 'model') continue;
    if (contents.length > 0 && contents[contents.length - 1].role === role) {
      contents[contents.length - 1].parts[0].text += '\n\n' + h.content;
    } else {
      contents.push({ role, parts: [{ text: h.content }] });
    }
  }

  const userParts = imageParts && imageParts.length > 0
    ? [...imageParts, { text: userMessage }]
    : [{ text: userMessage }];

  if (contents.length > 0 && contents[contents.length - 1].role === 'user') {
    contents[contents.length - 1].parts[0].text += '\n\n' + userMessage;
  } else {
    contents.push({ role: 'user', parts: userParts });
  }

  const body = {
    contents,
    systemInstruction: { parts: [{ text: systemPrompt }] },
    generationConfig: { temperature: 0.7, maxOutputTokens: 8192 },
  };

  const res = await fetch(`${GEMINI_STREAM_URL}&key=${GEMINI_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Gemini API error ${res.status}: ${errText}`);
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop();
    for (const line of lines) {
      if (line.startsWith('data: ')) {
        try {
          const data = JSON.parse(line.slice(6));
          const text = data?.candidates?.[0]?.content?.parts
            ?.filter(p => p.text && !p.thought)
            ?.map(p => p.text)
            ?.join('');
          if (text) yield text;
        } catch { /* skip malformed chunks */ }
      }
    }
  }
}

// ── AI Status ────────────────────────────────────────────────────────────────
router.get('/status', (req, res) => {
  res.json({
    mode: GEMINI_KEY ? 'live' : 'unconfigured',
    model: GEMINI_MODEL,
    configured: !!GEMINI_KEY,
  });
});

// ── Chat — SSE Streaming ─────────────────────────────────────────────────────
router.post('/chat', async (req, res) => {
  const { message, history, classLevel, course, stream, department, image } = req.body;
  if (!message) return res.status(400).json({ error: 'Message is required' });

  const context = buildStudentContext(classLevel, course, stream, department);
  const systemPrompt = SYSTEM_INSTRUCTION + (context ? '\n\n' + context : '');

  let imageParts = null;
  if (image && image.base64 && image.mimeType) {
    imageParts = [{ inlineData: { mimeType: image.mimeType, data: image.base64 } }];
  }

  // Set up SSE
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no');
  res.flushHeaders();
  res.write(`data: ${JSON.stringify({ type: 'start' })}\n\n`);

  if (!GEMINI_KEY) {
    res.write(`data: ${JSON.stringify({ type: 'error', error: '⚠️ The AI is not configured yet. Please add your GEMINI_API_KEY in the Render environment settings.' })}\n\n`);
    return res.end();
  }

  try {
    // Try streaming first
    let fullReply = '';
    for await (const chunk of streamGemini(message, history || [], systemPrompt, imageParts)) {
      fullReply += chunk;
      res.write(`data: ${JSON.stringify({ type: 'chunk', text: chunk })}\n\n`);
    }
    if (fullReply) {
      res.write(`data: ${JSON.stringify({ type: 'done', reply: fullReply, isSimulated: false })}\n\n`);
      return res.end();
    }
  } catch (streamErr) {
    console.error('[Chat Stream Error]', streamErr.message);
    // Fall through to non-streaming attempt
  }

  try {
    // Fallback: non-streaming
    const reply = await askGeminiWithHistory(message, history || [], systemPrompt, imageParts);
    res.write(`data: ${JSON.stringify({ type: 'done', reply, isSimulated: false })}\n\n`);
    return res.end();
  } catch (err) {
    console.error('[Chat Error]', err.message);

    // If Gemini fails (rate limit, quota, etc.), fall back to the built-in knowledge base
    if (err.message.includes('429') || err.message.includes('quota') || err.message.includes('RESOURCE_EXHAUSTED')) {
      try {
        const kbReply = simulateAIResponse('chat', message, history || [], { classLevel, course, stream, department });
        res.write(`data: ${JSON.stringify({ type: 'done', reply: kbReply, isSimulated: true })}\n\n`);
        return res.end();
      } catch (kbErr) {
        console.error('[Knowledge Base Fallback Error]', kbErr.message);
      }
    }

    const userMessage = err.message.includes('429')
      ? '⚠️ The AI is currently overloaded (rate limit reached). Using built-in knowledge engine.'
      : `⚠️ AI error: ${err.message}`;
    res.write(`data: ${JSON.stringify({ type: 'error', error: userMessage })}\n\n`);
    return res.end();
  }
});

// ── Summarize Notes ──────────────────────────────────────────────────────────
router.post('/summarize', async (req, res) => {
  const { content, classLevel, course, stream, department } = req.body;
  if (!content) return res.status(400).json({ error: 'Content is required' });

  if (!GEMINI_KEY) {
    return res.status(503).json({ error: '⚠️ AI is not configured. Please add GEMINI_API_KEY to Render environment settings.' });
  }

  const context = buildStudentContext(classLevel, course, stream, department);
  const prompt = `Summarize the following student notes into a clear, well-structured study summary.

## Key Concepts
- List the main ideas as concise bullet points with **bold** key terms

## Important Details
- Critical facts, formulas, or definitions the student must remember

## Study Tips
- 2-3 specific tips for reviewing this material

If the notes contain formulas or technical content, preserve them exactly.

---
NOTES:
${content}`;

  try {
    const summary = await askGemini(prompt, context ? SYSTEM_INSTRUCTION + '\n\n' + context : SYSTEM_INSTRUCTION);
    res.json({ summary, isSimulated: false });
  } catch (err) {
    console.error('[Summarize Error]', err.message);
    // Fall back to knowledge base for summarization
    if (err.message.includes('429') || err.message.includes('quota') || err.message.includes('RESOURCE_EXHAUSTED')) {
      try {
        const kbSummary = simulateAIResponse('summarize', content, [], { classLevel, course, stream, department });
        res.json({ summary: kbSummary, isSimulated: true });
        return;
      } catch (kbErr) {
        console.error('[Summarize KB Fallback Error]', kbErr.message);
      }
    }
    const msg = err.message.includes('429')
      ? '⚠️ AI rate limit reached. Using built-in knowledge engine.'
      : `⚠️ AI error: ${err.message}`;
    res.status(503).json({ error: msg });
  }
});

// ── Generate Flashcards ───────────────────────────────────────────────────────
router.post('/generate-cards', async (req, res) => {
  const { content, classLevel, course, stream, department } = req.body;
  if (!content) return res.status(400).json({ error: 'Content is required' });

  if (!GEMINI_KEY) {
    return res.status(503).json({ error: '⚠️ AI is not configured. Please add GEMINI_API_KEY to Render environment settings.' });
  }

  const context = buildStudentContext(classLevel, course, stream, department);
  const contextNote = context ? `\nSTUDENT LEVEL: ${context.trim()}\n` : '';
  const prompt = `Generate 5-7 high-quality study flashcards from the following notes.
${contextNote}
Rules:
- Each question should test understanding (ask "why", "how", "explain") — not just recall
- Answers must be concise but complete (1-3 sentences)
- Cover the most important concepts
- For math/science: focus on formulas and processes
- For humanities: focus on key themes, arguments, cause-effect

Return ONLY a raw JSON array, no markdown, no code fences:
[{"question": "...", "answer": "..."}]

---
NOTES:
${content}`;

  try {
    const rawText = await askGemini(prompt, 'You are an expert study flashcard generator. Always return valid JSON arrays only, no extra text.', 0.7);
    const clean = rawText.replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/m, '').trim();
    const match = clean.match(/\[[\s\S]*\]/);
    const flashcards = JSON.parse(match ? match[0] : clean);
    if (Array.isArray(flashcards) && flashcards.length > 0) {
      return res.json({ flashcards, isSimulated: false });
    }
    throw new Error('Invalid flashcard format returned.');
  } catch (err) {
    console.error('[Flashcards Error]', err.message);
    // Fall back to knowledge base for flashcard generation
    if (err.message.includes('429') || err.message.includes('quota') || err.message.includes('RESOURCE_EXHAUSTED')) {
      try {
        const kbCards = simulateAIResponse('generate-cards', content, [], { classLevel, course, stream, department });
        if (Array.isArray(kbCards) && kbCards.length > 0) {
          res.json({ flashcards: kbCards, isSimulated: true });
          return;
        }
      } catch (kbErr) {
        console.error('[Flashcards KB Fallback Error]', kbErr.message);
      }
    }
    const msg = err.message.includes('429')
      ? '⚠️ AI rate limit reached. Using built-in knowledge engine.'
      : `⚠️ AI error: ${err.message}`;
    res.status(503).json({ error: msg });
  }
});

// ── Generate Quiz ─────────────────────────────────────────────────────────────
router.post('/generate-quiz', async (req, res) => {
  const { content, classLevel, course, stream, department, questionCount } = req.body;
  if (!content) return res.status(400).json({ error: 'Content is required' });

  if (!GEMINI_KEY) {
    return res.status(503).json({ error: '⚠️ AI is not configured. Please add GEMINI_API_KEY to Render environment settings.' });
  }

  const context = buildStudentContext(classLevel, course, stream, department);
  const numQuestions = Math.min(Math.max(parseInt(questionCount) || 5, 1), 20);
  const difficulty = (req.body.difficulty || 'Medium').toLowerCase();
  const contextNote = context ? `\nSTUDENT LEVEL: ${context.trim()}\n` : '';

  const prompt = `Generate EXACTLY ${numQuestions} multiple-choice quiz questions about: "${content}"
${contextNote}
Difficulty: ${difficulty}
${difficulty === 'easy' ? 'Focus on definitions and basic recall.' : difficulty === 'hard' ? 'Focus on analysis, application, and complex reasoning.' : 'Mix of recall, application, and analysis.'}

Rules:
- Return ONLY a JSON array — no text before or after, no markdown
- Each question has 4 options (A, B, C, D), exactly ONE correct answer
- The "correct" field must be exactly: "A", "B", "C", or "D"
- Include a short explanation for the correct answer
- Questions must be SPECIFIC to: "${content}"

Format:
[{"question":"...","options":{"A":"...","B":"...","C":"...","D":"..."},"correct":"A","explanation":"..."}]`;

  try {
    const rawText = await askGemini(prompt, 'You are an expert quiz question generator. Always return valid JSON arrays only, no extra text.', 0.3);
    let clean = rawText.replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/m, '').trim();
    const first = clean.indexOf('[');
    const last = clean.lastIndexOf(']');
    if (first !== -1 && last > first) clean = clean.substring(first, last + 1);
    const quiz = JSON.parse(clean);
    if (Array.isArray(quiz) && quiz.length > 0) {
      const valid = quiz
        .map(q => ({ ...q, correct: typeof q.correct === 'string' ? q.correct.trim().toUpperCase() : q.correct }))
        .filter(q => q.question && q.options && ['A','B','C','D'].includes(q.correct) && q.options.A && q.options.B && q.options.C && q.options.D);
      if (valid.length > 0) {
        return res.json({ quiz: valid.slice(0, numQuestions), isSimulated: false });
      }
    }
    throw new Error('Invalid quiz format returned.');
  } catch (err) {
    console.error('[Quiz Error]', err.message);
    // Fall back to knowledge base for quiz generation
    if (err.message.includes('429') || err.message.includes('quota') || err.message.includes('RESOURCE_EXHAUSTED')) {
      try {
        const kbQuiz = simulateAIResponse('generate-quiz', content, [], { classLevel, course, stream, department });
        if (Array.isArray(kbQuiz) && kbQuiz.length > 0) {
          res.json({ quiz: kbQuiz.slice(0, numQuestions), isSimulated: true });
          return;
        }
      } catch (kbErr) {
        console.error('[Quiz KB Fallback Error]', kbErr.message);
      }
    }
    const msg = err.message.includes('429')
      ? '⚠️ AI rate limit reached. Using built-in knowledge engine.'
      : `⚠️ AI error: ${err.message}`;
    res.status(503).json({ error: msg });
  }
});

// ── Explain Concept ───────────────────────────────────────────────────────────
router.post('/explain', async (req, res) => {
  const { concept, classLevel, course, stream, department } = req.body;
  if (!concept) return res.status(400).json({ error: 'Concept is required' });

  if (!GEMINI_KEY) {
    return res.status(503).json({ error: '⚠️ AI is not configured. Please add GEMINI_API_KEY to Render environment settings.' });
  }

  const context = buildStudentContext(classLevel, course, stream, department);
  const prompt = `Explain the concept "${concept}" clearly and thoroughly.

## What is it?
A clear, concise definition.

## How does it work?
Step-by-step explanation with examples or analogies.

## Why does it matter?
Real-world applications and importance.

## Common mistakes
1-2 common misconceptions students make.

## Quick check
One self-test question the student can use to verify understanding.`;

  try {
    const explanation = await askGemini(prompt, context ? SYSTEM_INSTRUCTION + '\n\n' + context : SYSTEM_INSTRUCTION);
    res.json({ explanation, isSimulated: false });
  } catch (err) {
    console.error('[Explain Error]', err.message);
    // Fall back to knowledge base for concept explanation
    if (err.message.includes('429') || err.message.includes('quota') || err.message.includes('RESOURCE_EXHAUSTED')) {
      try {
        const kbExplanation = simulateAIResponse('chat', `Explain ${concept}`, [], { classLevel, course, stream, department });
        res.json({ explanation: kbExplanation, isSimulated: true });
        return;
      } catch (kbErr) {
        console.error('[Explain KB Fallback Error]', kbErr.message);
      }
    }
    const msg = err.message.includes('429')
      ? '⚠️ AI rate limit reached. Using built-in knowledge engine.'
      : `⚠️ AI error: ${err.message}`;
    res.status(503).json({ error: msg });
  }
});

// ── Image Upload ──────────────────────────────────────────────────────────────
router.post('/upload', upload.single('image'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  try {
    const mimeType = req.file.mimetype;
    const base64 = req.file.buffer.toString('base64');
    const dataUrl = `data:${mimeType};base64,${base64}`;
    res.json({ success: true, image: { mimeType, base64, dataUrl, size: req.file.size, originalName: req.file.originalname } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── Code Execution (Sandboxed) ────────────────────────────────────────────────
router.post('/execute', async (req, res) => {
  const { code, language } = req.body;
  if (!code) return res.status(400).json({ error: 'Code is required' });

  if (language && language !== 'javascript') {
    return res.status(400).json({ error: 'Only JavaScript execution is supported in the sandbox.' });
  }

  try {
    const vm = new VM({ timeout: 3000, sandbox: {} });
    const wrappedCode = `
      const __output = [];
      const console = {
        log(...args) { __output.push(args.map(a => typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a)).join(' ')); },
        error(...args) { __output.push('[ERROR] ' + args.map(a => typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a)).join(' ')); },
        warn(...args) { __output.push('[WARN] ' + args.map(a => typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a)).join(' ')); },
        info(...args) { __output.push(args.map(a => typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a)).join(' ')); }
      };
      ${code}
      JSON.stringify(__output);
    `;
    const result = vm.run(wrappedCode);
    const output = JSON.parse(result || '[]');
    res.json({ success: true, output: output.join('\n'), logs: output });
  } catch (err) {
    const errMsg = err.message || String(err);
    res.json({ success: false, error: errMsg, output: `[Execution Error] ${errMsg}` });
  }
});

export default router;
