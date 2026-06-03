// backend/utils/tokens.js
// Aproximación simple de tokens: ~4 caracteres por token en español.
// Suficiente para evitar payloads gigantes sin pagar el costo de un tokenizer real.

function approxTokens(text) {
  return Math.ceil((text || "").length / 4);
}

function truncateHistory(messages, maxTokens = 3000) {
  if (!Array.isArray(messages)) return [];
  const out = [];
  let total = 0;

  // Recorre desde el final (más reciente) hacia atrás
  for (let i = messages.length - 1; i >= 0; i--) {
    const m = messages[i];
    if (!m?.role || !m?.content) continue;
    const t = approxTokens(m.content);
    if (total + t > maxTokens) break;
    out.unshift({ role: m.role, content: m.content });
    total += t;
  }
  return out;
}

module.exports = { approxTokens, truncateHistory };
