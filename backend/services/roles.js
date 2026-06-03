// backend/services/roles.js
// Carga y expone el catálogo de roles desde los archivos mock por área.
// Reemplaza al seed de SQLite: la fuente de verdad ahora es backend/mocks/*.json.
// Los JSON se releen en cada request (son pocos y pequeños) para que editar un
// mock se refleje sin reiniciar el backend.

const fs = require("fs");
const path = require("path");

const MOCKS_DIR = path.join(__dirname, "..", "mocks");
const ESENCIALES_FILE = path.join(MOCKS_DIR, "_esenciales.md");
const HERRAMIENTAS_FILE = path.join(MOCKS_DIR, "_herramientas.md");
const EQUIPO_FILE = path.join(MOCKS_DIR, "_equipo.md");
const FLUJO_FILE = path.join(MOCKS_DIR, "_flujo.md");
const TIPS_FILE = path.join(MOCKS_DIR, "_primeros-60-dias.md");

let firstLoadLogged = false;

// Lee el markdown crudo en cada llamada (igual que los .json de área), así
// editar el mock no requiere reiniciar el backend en dev.
function getEsencialesContent() {
  try {
    return fs.readFileSync(ESENCIALES_FILE, "utf-8").trim();
  } catch (err) {
    console.warn(`[roles] no se pudo leer _esenciales.md: ${err.message}`);
    return "";
  }
}

// Parser genérico para mocks tipo {{INTRO}} / {{AREA:slug}} / {{AREA:default}}.
// Devuelve un mapa { INTRO: '...', 'AREA:desarrollo-digital': '...', ... }.
function parseAreaMock(filePath) {
  let raw = "";
  try {
    raw = fs.readFileSync(filePath, "utf-8");
  } catch (err) {
    console.warn(`[roles] no se pudo leer ${path.basename(filePath)}: ${err.message}`);
    return {};
  }

  const sections = {};
  // Split captura los marcadores: ['', 'INTRO', 'body', 'AREA:xyz', 'body', ...]
  const parts = raw.split(/\{\{(INTRO|AREA:[a-z0-9-]+)\}\}\s*/);
  for (let i = 1; i < parts.length; i += 2) {
    sections[parts[i]] = (parts[i + 1] || "").trim();
  }
  return sections;
}

// Devuelve INTRO + sección del área (o INTRO + AREA:default como fallback).
function getToolsContent(areaSlug) {
  const sections = parseAreaMock(HERRAMIENTAS_FILE);
  const intro = sections.INTRO || "";
  const areaBody =
    sections[`AREA:${areaSlug}`] ||
    sections["AREA:default"] ||
    "";

  if (!intro && !areaBody) return "";
  return [intro, areaBody].filter(Boolean).join("\n\n");
}

// Devuelve la sección del área (o AREA:default como fallback). Sin intro.
function getTeamContent(areaSlug) {
  const sections = parseAreaMock(EQUIPO_FILE);
  return (
    sections[`AREA:${areaSlug}`] ||
    sections["AREA:default"] ||
    ""
  );
}

// Devuelve INTRO + sección del área para "workflow" (o INTRO + AREA:default).
function getWorkflowContent(areaSlug) {
  const sections = parseAreaMock(FLUJO_FILE);
  const intro = sections.INTRO || "";
  const areaBody =
    sections[`AREA:${areaSlug}`] ||
    sections["AREA:default"] ||
    "";

  if (!intro && !areaBody) return "";
  return [intro, areaBody].filter(Boolean).join("\n\n");
}

// Devuelve el contenido de "Primeros 60 días". Es universal: un único markdown.
function getTipsContent() {
  try {
    return fs.readFileSync(TIPS_FILE, "utf-8").trim();
  } catch (err) {
    console.warn(`[roles] no se pudo leer _primeros-60-dias.md: ${err.message}`);
    return "";
  }
}

function buildCatalog() {
  const files = fs.readdirSync(MOCKS_DIR).filter(f => f.endsWith(".json"));
  const areas = [];
  const rolesBySlug = new Map();

  for (const file of files) {
    const raw = fs.readFileSync(path.join(MOCKS_DIR, file), "utf-8");
    const data = JSON.parse(raw);

    areas.push({
      area: data.area,
      label: data.label || data.area,
      icono: data.icono || "",
      descripcion: data.descripcion || "",
    });

    for (const [slug, role] of Object.entries(data.roles || {})) {
      if (rolesBySlug.has(slug)) {
        console.warn(`[roles] slug duplicado: "${slug}" (archivo ${file})`);
      }
      rolesBySlug.set(slug, {
        ...role,
        slug,
        area: data.area,
        areaLabel: data.label || data.area,
      });
    }
  }

  return { areas, rolesBySlug };
}

// Mantengo el nombre `loadCatalog` para no romper a server.js. Solo loguea
// la primera vez para no contaminar la consola en cada request.
function loadCatalog() {
  const catalog = buildCatalog();
  if (!firstLoadLogged) {
    console.log(`[roles] catálogo cargado: ${catalog.areas.length} áreas, ${catalog.rolesBySlug.size} roles`);
    firstLoadLogged = true;
  }
  return catalog;
}

function getAllRoles() {
  const { rolesBySlug } = buildCatalog();
  return Array.from(rolesBySlug.values()).map(r => ({
    slug: r.slug,
    nombre: r.nombre,
    area: r.area,
    areaLabel: r.areaLabel,
    icono: r.icono || "",
    descripcion_corta: r.descripcion_corta || "",
  }));
}

function getAreas() {
  return buildCatalog().areas;
}

function getRoleBySlug(slug) {
  return buildCatalog().rolesBySlug.get(slug) || null;
}

function getSkillContent(slug, skill) {
  const role = getRoleBySlug(slug);
  if (!role) return null;
  return role.skills?.[skill] ?? "";
}

module.exports = {
  loadCatalog,
  getAllRoles,
  getAreas,
  getRoleBySlug,
  getSkillContent,
  getEsencialesContent,
  getToolsContent,
  getTeamContent,
  getWorkflowContent,
  getTipsContent,
};
