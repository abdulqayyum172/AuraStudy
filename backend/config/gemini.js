import dotenv from 'dotenv';
dotenv.config();

export const GEMINI_KEY = process.env.GEMINI_API_KEY || '';
export const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-2.0-flash';
export const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;
export const GEMINI_STREAM_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:streamGenerateContent?alt=sse`;

export const SYSTEM_INSTRUCTION = `You are Aura, an expert AI study tutor, mentor, and academic assistant built into AuraStudy — an intelligent learning platform for students across all levels (Basic Primary, Junior Secondary JSS, Senior Secondary SSS, Higher Institution / University) and software developers learning to code.

## STRICT TOPIC RULE — READ FIRST
When a user submits a topic to learn about, you MUST:
1. Generate study content STRICTLY about that exact topic — nothing else.
2. NEVER substitute, reinterpret, generalize, or switch to a different (even closely related) topic.
3. If the topic is ambiguous or spelled unusually, choose the most common/standard interpretation — do not pick an unrelated subject.
4. If the topic is nonsensical, empty, or not a real subject, respond only with: "I couldn't identify a valid topic. Please rephrase or clarify." — do not generate content about a different topic instead.
5. Before answering, internally verify: "Does my response directly address the requested topic and nothing else?" If not, correct it before responding.
6. NEVER respond with content about a topic other than the one requested, even if another topic seems more popular, more common, or easier to explain.

## Core Responsibilities
- Explain concepts clearly, thoroughly, and precisely at the student's academic level.
- Provide DETAILED explanations — aim for comprehensive coverage, not surface-level summaries. Every explanation should include: definition, core principles, step-by-step breakdowns, worked examples, real-world applications, common mistakes, and practice problems.
- Use real-world analogies, step-by-step breakdowns, and practical examples.
- When a student's class level, stream (Science/Art/Commercial), or course is provided, tailor ALL explanations, vocabulary, and difficulty strictly to that level.
- Format responses cleanly using GitHub-flavored Markdown (headers, bold key terms, tables, bullet points, and syntax-highlighted code blocks).
- Every explanation MUST include these sections when applicable:
  ## Definition — What is it?
  ## Core Principles — How does it work? (detailed, with sub-points)
  ## Step-by-Step Breakdown — Walk through the process/logic
  ## Worked Examples — At least 1-2 concrete examples with full solutions
  ## Real-World Applications — Where is it used?
  ## Common Mistakes to Avoid
  ## Key Formulas/Theorems (if applicable)
  ## Practice Problems — 2-3 questions for the student to try
  ## Quick Review Summary — Bullet-point recap
- Encourage active learning and retention by providing quick self-test check questions or study tips at the end of explanations.
- For math and science, show detailed step-by-step working with all intermediate steps visible.
- For programming, provide clean, modern, production-grade working code examples with line-by-line explanations.
- Always be encouraging, friendly, supportive, and precise. Never provide placeholder text or generic fluff.
- Aim for responses that are 300-800 words for topic explanations — be thorough, not brief.`;

export const geminiState = {
  status: 'live',
  reason: null,
  cooldownUntil: 0,
  lastSuccessAt: 0,
  lastError: null,
  cooldownMs: 60_000,
};

export function setGeminiStatus(status, reason = null) {
  geminiState.status = status;
  geminiState.reason = reason;
  if (status === 'live') {
    geminiState.cooldownUntil = 0;
    geminiState.lastSuccessAt = Date.now();
  }
}

export let geminiReady = false;

export function isGeminiAvailable() {
  if (!geminiReady) return false;
  if (geminiState.status === 'live') return true;
  if (geminiState.status === 'cooling_down' && Date.now() >= geminiState.cooldownUntil) {
    setGeminiStatus('live');
    return true;
  }
  return geminiState.status === 'live';
}

export async function fetchWithRetry(url, options, maxRetries = 4) {
  let delay = 3000;
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    const response = await fetch(url, options);
    if (response.status !== 429 && response.status !== 503) {
      if (response.ok) {
        setGeminiStatus('live');
      }
      return response;
    }

    let explicitDelayMs = 0;
    const retryAfter = response.headers.get('retry-after');
    if (retryAfter) {
      const secs = parseFloat(retryAfter);
      if (!isNaN(secs)) explicitDelayMs = secs * 1000;
    }
    if (!explicitDelayMs) {
      try {
        const clone = response.clone();
        const body = await clone.text();
        const m = body.match(/"retryDelay"\s*:\s*"(\d+(?:\.\d+)?)s"/);
        if (m) explicitDelayMs = parseFloat(m[1]) * 1000;
      } catch { /* ignore */ }
    }

    if (response.status === 429) {
      let bodyText = '';
      try { bodyText = await response.clone().text(); } catch {}
      const lower = bodyText.toLowerCase();
      const isQuotaError = lower.includes('quota') || lower.includes('limit') || lower.includes('billing') || lower.includes('resource_exhausted');

      geminiState.lastError = {
        status: response.status,
        message: (bodyText.match(/"message"\s*:\s*"([^"]+)"/) || [, ''])[1].slice(0, 200),
        at: Date.now(),
      };

      if (isQuotaError) {
        const cooldownMs = Math.max(geminiState.cooldownMs, explicitDelayMs + 1000);
        geminiState.cooldownUntil = Date.now() + cooldownMs;
        setGeminiStatus('cooling_down', `Gemini quota exceeded (status 429). Cooling down for ${Math.round(cooldownMs / 1000)}s.`);
        console.warn(`⚠️ [Gemini] Quota/limit exceeded. Cooling down for ${Math.round(cooldownMs / 1000)}s. After cooldown, the AI routes will auto-retry.`);
        return response;
      }
    }

    if (attempt === maxRetries) return response;

    const wait = Math.max(delay, explicitDelayMs);
    console.log(`[Gemini] ${response.status} error. Retrying in ${Math.round(wait / 1000)}s… (attempt ${attempt}/${maxRetries})`);
    await new Promise(r => setTimeout(r, wait));
    delay = Math.min(delay * 2, 30_000);
  }
}

export async function callGemini(userMessage, history = [], contextInstruction = '') {
  const systemText = SYSTEM_INSTRUCTION + (contextInstruction ? '\n\n' + contextInstruction : '');

  const contents = [];

  const cleanHistory = (history || []).filter(
    h => h && h.content && typeof h.content === 'string' && h.content.trim().length > 0
  );

  for (const h of cleanHistory) {
    const role = (h.role === 'assistant' || h.role === 'model') ? 'model' : 'user';

    if (contents.length === 0 && role === 'model') {
      continue;
    }

    if (contents.length > 0 && contents[contents.length - 1].role === role) {
      contents[contents.length - 1].parts[0].text += '\n\n' + h.content;
    } else {
      contents.push({ role, parts: [{ text: h.content }] });
    }
  }

  if (contents.length > 0 && contents[contents.length - 1].role === 'user') {
    if (contents[contents.length - 1].parts[0].text !== userMessage) {
      contents[contents.length - 1].parts[0].text += '\n\n' + userMessage;
    }
  } else {
    contents.push({ role: 'user', parts: [{ text: userMessage }] });
  }

  const body = {
    contents,
    systemInstruction: { parts: [{ text: systemText }] },
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 8192,
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

  const text = data?.candidates?.[0]?.content?.parts
    ?.filter(p => p.text && !p.thought)
    ?.map(p => p.text)
    ?.join('');
  if (!text) throw new Error('Empty response from Gemini API');
  return text;
}

export function buildGeminiContents(userMessage, history = [], imageParts = null) {
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
  const userParts = [{ text: userMessage }];
  if (imageParts && imageParts.length > 0) {
    userParts.unshift(...imageParts);
  }
  if (contents.length > 0 && contents[contents.length - 1].role === 'user') {
    if (contents[contents.length - 1].parts[0].text !== userMessage) {
      contents[contents.length - 1].parts[0].text += '\n\n' + userMessage;
    }
  } else {
    contents.push({ role: 'user', parts: userParts });
  }
  return contents;
}

export async function* callGeminiStream(userMessage, history = [], contextInstruction = '', imageParts = null) {
  const systemText = SYSTEM_INSTRUCTION + (contextInstruction ? '\n\n' + contextInstruction : '');
  const contents = buildGeminiContents(userMessage, history, imageParts);

  const body = {
    contents,
    systemInstruction: { parts: [{ text: systemText }] },
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 8192,
    }
  };

  const response = await fetchWithRetry(`${GEMINI_STREAM_URL}&key=${GEMINI_KEY}`, {
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

  const reader = response.body.getReader();
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
        } catch (e) { /* skip malformed chunks */ }
      }
    }
  }
}

export const STRICT_AI = String(process.env.STRICT_AI || '').toLowerCase() === 'true';

export default function initGemini() {
  if (GEMINI_KEY) {
    console.log(`✅ Gemini API configured — model: ${GEMINI_MODEL}, key length: ${GEMINI_KEY.length}`);
    console.log(`   Non-streaming URL: ${GEMINI_URL}`);
    console.log(`   Streaming URL:     ${GEMINI_STREAM_URL}`);
    geminiReady = true;
  } else {
    console.log('⚡ GEMINI_API_KEY not set. Using built-in Knowledge Engine for AI Assistant.');
  }

  if (STRICT_AI) {
    console.log('🛑 STRICT_AI mode is ON — fallback to knowledge engine is DISABLED. Routes will return 502 on Gemini failure.');
  } else {
    console.log('ℹ️  STRICT_AI mode is OFF (default) — fallback to knowledge engine is enabled when Gemini fails.');
  }

  return { geminiReady, GEMINI_MODEL, STRICT_AI };
}
