// Cliente fetch al backend Express local.
// La URL se resuelve preguntando a Electron por el puerto (o cae a env de Vite en web).

let cachedBase = null;

async function getBaseURL() {
  if (cachedBase) return cachedBase;

  // Si corre dentro de Electron, preload expone opAPI
  if (window.opAPI?.getBackendPort) {
    const port = await window.opAPI.getBackendPort();
    cachedBase = `http://127.0.0.1:${port}`;
  } else {
    // Modo browser dev (sin Electron): toma del env de Vite o usa default
    const port = import.meta.env.VITE_BACKEND_PORT || 4317;
    cachedBase = `http://127.0.0.1:${port}`;
  }
  return cachedBase;
}

async function request(path, options = {}) {
  const base = await getBaseURL();
  const res = await fetch(`${base}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  const data = await res.json().catch(() => ({ ok: false, error: "Respuesta inválida" }));
  if (!data.ok) throw new Error(data.error || `HTTP ${res.status}`);
  return data;
}

export const api = {
  getRoles:        ()                       => request("/api/ai/roles"),
  registerSession: (roleSlug)               => request("/api/ai/session", { method: "POST", body: JSON.stringify({ roleSlug }) }),
  getSkill:        (skill, roleSlug, refresh = false) =>
    request(`/api/ai/skill/${skill}`, { method: "POST", body: JSON.stringify({ roleSlug, refresh }) }),
  sendChat:        (roleSlug, message)      => request("/api/ai/chat", { method: "POST", body: JSON.stringify({ roleSlug, message }) }),
  getChatHistory:  (roleSlug)               => request(`/api/ai/chat/${roleSlug}`),
  sendFeedback:    (roleSlug, rating, comment) =>
    request("/api/ai/feedback", { method: "POST", body: JSON.stringify({ roleSlug, rating, comment }) }),
};
