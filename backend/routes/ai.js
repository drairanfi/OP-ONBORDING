// backend/routes/ai.js
// Endpoints REST. La API key NUNCA viaja al frontend y SOLO se usa para /chat.
// El catálogo de roles y las skills se sirven desde backend/mocks/*.json.

const express = require("express");
const router = express.Router();

const { getDb } = require("../db");
const {
  getAllRoles,
  getRoleBySlug,
  getSkillContent,
  getEsencialesContent,
  getToolsContent,
  getTeamContent,
  getWorkflowContent,
  getTipsContent,
} = require("../services/roles");
const { runChat } = require("../services/openai");

const VALID_SKILLS = ["esenciales", "role", "team", "workflow", "tools", "tips"];

// Envuelve el contenido per-rol del mock con un intro/outro cálidos. La
// descripción técnica del rol vive en el JSON; aquí solo le ponemos marco
// para que el usuario no aterrice en un bloque seco de "será responsable de...".
function wrapRoleContent(role, body) {
  const intro = `¡Bienvenida o bienvenido al equipo de OP Latam!

Tu nuevo rol es **${role.nombre}** — abajo tienes el resumen de lo que vas a hacer aquí. No te abrumes con el detalle: nadie espera que domines todo desde el día uno. Léelo como un mapa de a dónde vas, no como un checklist del lunes.

---

`;

  const outro = `

---

### ¿Dudas mientras lees?
- Pregúntale al **chat IA** acá en la app — te responde con contexto de tu rol.
- Habla con tu **manager directo** — está esperando tus preguntas, no las guardes.
- Revisa **Mi Equipo** y **Esenciales** para ubicarte en el entorno.

El onboarding es para ti. Tómate las primeras semanas para entender el ritmo, las personas y los proyectos — el resto llega solo.`;

  if (!body) {
    return (
      intro +
      `_El detalle específico de este rol todavía está en construcción. Mientras tanto, usa el chat IA para preguntar cualquier cosa sobre tu posición — tiene contexto sobre el rol._` +
      outro
    );
  }
  return intro + body + outro;
}

// ─── GET /api/ai/roles → catálogo de roles ───
router.get("/roles", (_, res) => {
  res.json({ ok: true, roles: getAllRoles() });
});

// ─── GET /api/ai/skill/:skill?roleSlug=... → contenido pre-escrito del mock ───
// También se acepta POST por compatibilidad con el cliente actual.
function handleSkill(req, res) {
  const { skill } = req.params;
  const roleSlug = req.body?.roleSlug || req.query?.roleSlug;

  if (!VALID_SKILLS.includes(skill)) {
    return res.status(400).json({ ok: false, error: `Skill inválida: ${skill}` });
  }

  // "esenciales" es contenido institucional: mismo texto para todos los roles.
  // Se sirve desde backend/mocks/_esenciales.md (editable sin tocar código).
  if (skill === "esenciales") {
    const content = getEsencialesContent();
    if (!content) {
      return res.json({
        ok: true,
        content: "_Contenido de Esenciales aún no disponible — falta backend/mocks/_esenciales.md._",
        empty: true,
      });
    }
    return res.json({ ok: true, content, empty: false });
  }

  if (!roleSlug) {
    return res.status(400).json({ ok: false, error: "roleSlug es requerido" });
  }

  const role = getRoleBySlug(roleSlug);
  if (!role) return res.status(404).json({ ok: false, error: "Rol no encontrado" });

  // Para "tools" usamos el mock por-área (backend/mocks/_herramientas.md), que
  // shadowea el contenido por-rol — ese campo describía habilidades, no apps.
  if (skill === "tools") {
    const toolsContent = getToolsContent(role.area);
    if (toolsContent) {
      return res.json({ ok: true, content: toolsContent, empty: false });
    }
  }

  // Para "team" usamos el mock por-área (backend/mocks/_equipo.md). Cada área
  // puede definir su propia estructura (ej. squads en desarrollo-digital); si
  // no hay match específico, cae al AREA:default.
  if (skill === "team") {
    const teamContent = getTeamContent(role.area);
    if (teamContent) {
      return res.json({ ok: true, content: teamContent, empty: false });
    }
  }

  // Para "workflow" usamos el mock por-área (backend/mocks/_flujo.md). El campo
  // workflow del JSON por-rol está vacío para todos; este mock cubre las 8 áreas.
  if (skill === "workflow") {
    const workflowContent = getWorkflowContent(role.area);
    if (workflowContent) {
      return res.json({ ok: true, content: workflowContent, empty: false });
    }
  }

  // Para "tips" servimos la guía universal de primeros 60 días desde
  // backend/mocks/_primeros-60-dias.md. Shadowea el campo "tips" del JSON
  // por-rol, que estaba mal etiquetado (eran soft skills, no consejos de onboarding).
  if (skill === "tips") {
    const tipsContent = getTipsContent();
    if (tipsContent) {
      return res.json({ ok: true, content: tipsContent, empty: false });
    }
  }

  const content = getSkillContent(roleSlug, skill);

  // Para "role" envolvemos la descripción técnica con un marco cálido.
  if (skill === "role") {
    return res.json({ ok: true, content: wrapRoleContent(role, content), empty: false });
  }

  if (!content) {
    return res.json({
      ok: true,
      content: `_Contenido aún no disponible para "${role.nombre}" en la skill "${skill}"._`,
      empty: true,
    });
  }

  res.json({ ok: true, content, empty: false });
}

router.post("/skill/:skill", handleSkill);
router.get("/skill/:skill", handleSkill);

// ─── POST /api/ai/chat → chat libre (única llamada que usa OpenAI) ───
// Acepta modo "guest" cuando aún no hay rol seleccionado: en ese caso no se
// persiste historial y el prompt cambia para ayudar al usuario a encontrar su rol.
router.post("/chat", async (req, res) => {
  const { roleSlug, message } = req.body || {};
  if (!message?.trim()) {
    return res.status(400).json({ ok: false, error: "message es requerido" });
  }

  const safeMessage = String(message).slice(0, 4000);

  const isGuest = !roleSlug || roleSlug === "guest";
  const role = isGuest ? null : getRoleBySlug(roleSlug);
  if (!isGuest && !role) {
    return res.status(404).json({ ok: false, error: "Rol no encontrado" });
  }

  const db = getDb();

  // Sólo traemos historial cuando hay rol; el guest es efímero.
  const history = isGuest
    ? []
    : db.prepare(`
        SELECT rol_mensaje AS role, contenido AS content
        FROM historial_chat
        WHERE role_slug = ?
        ORDER BY creado_en DESC
        LIMIT 20
      `).all(roleSlug).reverse();

  try {
    const reply = await runChat({
      role,
      history,
      message: safeMessage,
    });

    if (!isGuest) {
      const insert = db.prepare(
        "INSERT INTO historial_chat (role_slug, rol_mensaje, contenido) VALUES (?, ?, ?)"
      );
      const tx = db.transaction(() => {
        insert.run(roleSlug, "user", safeMessage);
        insert.run(roleSlug, "assistant", reply);
      });
      tx();
    }

    res.json({ ok: true, content: reply });
  } catch (err) {
    console.error("[ai/chat]", err.message);
    res.status(500).json({ ok: false, error: friendlyError(err) });
  }
});

// ─── GET historial de chat ───
router.get("/chat/:roleSlug", (req, res) => {
  const { roleSlug } = req.params;
  const role = getRoleBySlug(roleSlug);
  if (!role) return res.status(404).json({ ok: false, error: "Rol no encontrado" });

  const messages = getDb().prepare(`
    SELECT rol_mensaje AS role, contenido AS content, creado_en
    FROM historial_chat
    WHERE role_slug = ?
    ORDER BY creado_en ASC
    LIMIT 200
  `).all(roleSlug);

  res.json({ ok: true, messages });
});

// ─── POST /api/ai/session → registra apertura de sesión ───
router.post("/session", (req, res) => {
  const { roleSlug } = req.body || {};
  const role = getRoleBySlug(roleSlug);
  if (!role) return res.status(404).json({ ok: false, error: "Rol no encontrado" });

  getDb().prepare(
    "INSERT INTO usuario_sesion (role_slug) VALUES (?)"
  ).run(roleSlug);

  res.json({ ok: true });
});

// ─── POST /api/ai/feedback → guarda una reseña de la app ───
// calificacion 1-5 (requerida), comentario opcional, role_slug opcional (modo guest).
router.post("/feedback", (req, res) => {
  const { roleSlug, rating, comment } = req.body || {};

  const calificacion = Number(rating);
  if (!Number.isInteger(calificacion) || calificacion < 1 || calificacion > 5) {
    return res.status(400).json({ ok: false, error: "rating debe ser un entero entre 1 y 5" });
  }

  const comentario = comment ? String(comment).slice(0, 2000).trim() : null;
  const slug = roleSlug && roleSlug !== "guest" ? String(roleSlug) : null;

  getDb().prepare(
    "INSERT INTO resena_app (role_slug, calificacion, comentario) VALUES (?, ?, ?)"
  ).run(slug, calificacion, comentario);

  res.json({ ok: true });
});

function friendlyError(err) {
  const status = err?.status || err?.response?.status;
  if (status === 401) return "API key inválida. Revisa tu archivo .env";
  if (status === 429) return "Límite de uso alcanzado. Intenta en unos segundos.";
  if (status >= 500)  return "OpenAI no está disponible en este momento.";
  return err?.message || "Error desconocido";
}

module.exports = router;
