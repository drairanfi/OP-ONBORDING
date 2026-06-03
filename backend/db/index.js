// backend/db/index.js
// Conexión SQLite (better-sqlite3). Solo persiste historial de chat y sesiones.
// El catálogo de roles vive en backend/mocks/*.json.

const path = require("path");
const fs = require("fs");
const Database = require("better-sqlite3");

let db = null;

function getDbPath() {
  return process.env.DB_PATH
    ? path.resolve(process.cwd(), process.env.DB_PATH)
    : path.join(__dirname, "op-onboarding.sqlite");
}

// Migración destructiva: las tablas legacy usaban role_id (INTEGER, FK a roles).
// El nuevo esquema usa role_slug (TEXT) y elimina las tablas roles/contenido_base.
// Como el catálogo cambió por completo, el historial viejo ya no es referenciable.
function migrateLegacy(db) {
  const hasOldSchema = (table, oldCol) => {
    const cols = db.prepare(`PRAGMA table_info(${table})`).all().map(c => c.name);
    return cols.includes(oldCol);
  };

  if (hasOldSchema("historial_chat", "role_id")) {
    console.log("[db] migrando: drop historial_chat legacy");
    db.exec("DROP TABLE IF EXISTS historial_chat");
  }
  if (hasOldSchema("usuario_sesion", "role_id")) {
    console.log("[db] migrando: drop usuario_sesion legacy");
    db.exec("DROP TABLE IF EXISTS usuario_sesion");
  }
  db.exec("DROP TABLE IF EXISTS contenido_base");
  db.exec("DROP TABLE IF EXISTS roles");
}

function initDb() {
  if (db) return db;
  const dbPath = getDbPath();
  db = new Database(dbPath);
  db.pragma("journal_mode = WAL");
  db.pragma("foreign_keys = ON");

  migrateLegacy(db);

  const schema = fs.readFileSync(path.join(__dirname, "schema.sql"), "utf-8");
  db.exec(schema);

  return db;
}

function getDb() {
  if (!db) initDb();
  return db;
}

module.exports = { initDb, getDb };
