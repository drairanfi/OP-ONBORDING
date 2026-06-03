// backend/services/openai.js
// Cliente OpenAI para el chat libre. Las skills (role/team/workflow/tools/tips)
// se sirven desde los archivos mock — la API key SOLO se usa aquí.

const OpenAI = require("openai");
const { SYSTEM_PROMPT, buildChatPrompt } = require("./prompts");
const { truncateHistory } = require("../utils/tokens");

if (!process.env.OPENAI_API_KEY) {
  console.warn("[openai] ⚠ OPENAI_API_KEY no está definido en .env");
}

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const MODEL = process.env.OPENAI_MODEL || "gpt-4o-mini";

async function withRetry(fn, { maxAttempts = 3, baseMs = 600 } = {}) {
  let lastErr;
  for (let i = 0; i < maxAttempts; i++) {
    try {
      return await fn();
    } catch (err) {
      lastErr = err;
      const status = err?.status || err?.response?.status;
      if (status === 401 || status === 400) throw err;
      const waitMs = baseMs * Math.pow(2, i);
      await new Promise(r => setTimeout(r, waitMs));
    }
  }
  throw lastErr;
}

async function runChat({ role, history = [], message }) {
  const safeHistory = truncateHistory(history, 3000);
  const userPrompt = buildChatPrompt({ role, userInput: message });

  const messages = [
    { role: "system", content: SYSTEM_PROMPT },
    ...safeHistory,
    { role: "user", content: userPrompt },
  ];

  const response = await withRetry(() => client.chat.completions.create({
    model: MODEL,
    messages,
    temperature: 0.7,
    max_tokens: 700,
  }));

  return response.choices?.[0]?.message?.content?.trim() || "";
}

module.exports = { runChat };
