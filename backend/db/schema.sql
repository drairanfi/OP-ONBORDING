-- backend/db/schema.sql
-- La base de datos solo persiste el historial del chat y las sesiones.
-- El catálogo de roles vive en backend/mocks/*.json.

CREATE TABLE IF NOT EXISTS historial_chat (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  role_slug TEXT NOT NULL,
  rol_mensaje TEXT NOT NULL CHECK(rol_mensaje IN ('user','assistant')),
  contenido TEXT NOT NULL,
  creado_en DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS usuario_sesion (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  role_slug TEXT,
  primera_apertura DATETIME DEFAULT CURRENT_TIMESTAMP,
  completado_at DATETIME
);

-- Reseñas de la app: calificación 1-5 + comentario opcional con sugerencias.
CREATE TABLE IF NOT EXISTS resena_app (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  role_slug TEXT,
  calificacion INTEGER NOT NULL CHECK(calificacion BETWEEN 1 AND 5),
  comentario TEXT,
  creado_en DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_chat_role_time ON historial_chat(role_slug, creado_en);
