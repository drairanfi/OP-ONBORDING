# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

All scripts run from the repo root. Frontend has its own `package.json` and its deps must be installed separately the first time:

```bash
npm install
cd frontend && npm install && cd ..
cp .env.example .env   # then paste a real OPENAI_API_KEY

npm run dev            # Vite (5173) + Electron in dev; backend is loaded in-process by Electron
npm run dev:backend    # Standalone Express on 127.0.0.1:4317 (useful for hitting /api/* with curl)
npm run dev:frontend   # Vite only — for browser-only debugging of the React app

npm run build          # frontend Vite build → frontend/dist, then electron-builder (NSIS for Windows)
npm start              # Runs the packaged Electron app against the built frontend
```

Note: the README mentions `npm run db:seed`, but that script no longer exists. The role catalog is now loaded from `backend/mocks/*.json` at server startup (see "Architecture drift" below), and SQLite is created/migrated automatically by `initDb()` on first run.

There is no test runner, linter, or formatter configured.

## Architecture

Electron desktop app with an embedded Express backend. One Node process, two surfaces:

- **Electron main** (`electron/main.js`) requires `backend/server.js` directly and calls `startServer()`, so the backend runs *inside* the main process. The OpenAI key from `.env` is therefore only ever in the Node side — the renderer cannot see it.
- **Renderer** is the Vite React app. It discovers the backend port via IPC: `electron/preload.js` exposes `window.opAPI.getBackendPort()`, which the renderer calls before any `fetch`. In standalone browser mode (no Electron), `frontend/src/api/client.js` falls back to `VITE_BACKEND_PORT` or `4317`. All API calls hit `http://127.0.0.1:<port>`.
- **Frameless window**: `electron/main.js` registers `window:minimize|maximize|close` IPC handlers used by `components/ui/TitleBar`. Renderer drag region is set in CSS.

### Backend routes (`backend/routes/ai.js`)

| Endpoint | Source | Notes |
| --- | --- | --- |
| `GET /api/ai/roles` | `backend/mocks/*.json` (in-memory) | Catalog of areas + roles |
| `GET\|POST /api/ai/skill/:skill` | `backend/mocks/*.json` (in-memory) | **No OpenAI call.** Returns pre-written markdown. Valid skills: `role`, `team`, `workflow`, `tools`, `tips` |
| `POST /api/ai/chat` | OpenAI | The only endpoint that touches OpenAI |
| `GET /api/ai/chat/:roleSlug` | SQLite `historial_chat` | Last 200 messages |
| `POST /api/ai/session` | SQLite `usuario_sesion` | Records a session open |

### Two sources of truth — do not confuse them

1. **`backend/mocks/<area>.json`** — the role catalog. Each file represents one area and contains `{ area, label, icono, descripcion, roles: { <slug>: { nombre, skills: { role, team, workflow, tools, tips }, ... } } }`. Loaded once at startup by `backend/services/roles.js::loadCatalog()` and cached in memory. To add a role or change a skill's markdown, edit the JSON — no DB migration, no restart of anything except the Node process.
2. **SQLite (`backend/db/op-onboarding.sqlite`)** — runtime-only data: `historial_chat` and `usuario_sesion`. Schema is in `backend/db/schema.sql` and applied by `initDb()` on every startup.

### Architecture drift to be aware of

The README still describes an older design where AI-generated skill content was cached in a `contenido_base` SQLite table and seeded by `backend/db/seed.js`. **That has been removed.** The current `backend/db/index.js::migrateLegacy()` **drops** `contenido_base` and `roles` (and any `historial_chat`/`usuario_sesion` rows that used the old `role_id` integer FK) on startup. The chat tables now key on `role_slug TEXT`. Implications:

- Do not re-introduce a `roles` SQL table — slugs are the join key and the catalog is JSON-only.
- If you change the legacy migration logic, remember it currently runs on **every** boot; it's idempotent because the offending columns no longer exist after the first migration.
- The README's "Flujo de datos" section (cache hit/miss on `contenido_base`, `runSkill()` calling OpenAI) does not match the code — skills are static markdown from the mocks.

### OpenAI integration (`backend/services/openai.js`)

Only `runChat` exists. Defaults: model `gpt-4o-mini` (override with `OPENAI_MODEL`), `temperature: 0.7`, `max_tokens: 700`. Retry is exponential, 3 attempts, but `withRetry` **does not retry on 400/401** — those errors are surfaced immediately. Chat history fed to the model is truncated by `backend/utils/tokens.js::truncateHistory(history, 3000)` and chat input is hard-capped to 4000 chars in the route before being sent.

### Frontend structure (`frontend/src/`)

- `router.jsx` uses `HashRouter` (required for `file://` loading in packaged Electron).
- `store/useAppStore.js` — Zustand store (selected role, etc.).
- `hooks/useAI.js` — wraps the `api` client for components.
- `components/SkillView.jsx` renders the skill markdown via `react-markdown` + `remark-gfm`.
- Tailwind tokens in `frontend/tailwind.config.js` mirror the OP Brand Guideline (`level_1`–`level_6` surfaces, `op_blue_600` CTA, Mulish). Prefer these tokens over hardcoded hex values.

### Security boundaries already enforced — keep them

- `OPENAI_API_KEY` is read only in the Node process. Never expose it to the renderer or import it from frontend code.
- Express binds to `127.0.0.1` only. CORS allows `localhost` origins and `file://` (no Origin header). Don't widen this.
- Electron uses `contextIsolation: true`, `nodeIntegration: false`. New renderer↔main APIs must go through `preload.js` and `contextBridge`.
