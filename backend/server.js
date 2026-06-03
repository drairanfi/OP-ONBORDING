// backend/server.js
// Servidor Express embebido. Solo escucha en 127.0.0.1.

const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

const express = require("express");
const cors = require("cors");
const aiRoutes = require("./routes/ai");
const { initDb } = require("./db");
const { loadCatalog } = require("./services/roles");

async function startServer() {
  initDb();
  loadCatalog();

  const app = express();

  // CORS restringido a Vite dev y file:// de Electron
  app.use(cors({
    origin: (origin, cb) => {
      if (!origin) return cb(null, true);                  // peticiones desde file://
      if (origin.startsWith("http://localhost")) return cb(null, true);
      return cb(new Error("CORS blocked"));
    },
  }));

  app.use(express.json({ limit: "200kb" }));

  app.get("/api/health", (_, res) => res.json({ ok: true, ts: Date.now() }));
  app.use("/api/ai", aiRoutes);

  const port = Number(process.env.BACKEND_PORT) || 4317;

  return new Promise((resolve, reject) => {
    const server = app.listen(port, "127.0.0.1", () => {
      const actualPort = server.address().port;
      console.log(`[backend] listening on http://127.0.0.1:${actualPort}`);
      resolve({
        port: actualPort,
        close: () => server.close(),
      });
    });
    server.on("error", reject);
  });
}

module.exports = { startServer };

// Permite ejecutar el backend en standalone para `npm run dev:backend`
if (require.main === module) {
  startServer().catch(err => {
    console.error("[backend] failed to start:", err);
    process.exit(1);
  });
}
