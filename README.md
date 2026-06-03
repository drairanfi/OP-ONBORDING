# OP Latam — Onboarding App

App desktop (Electron + React + Vite + TailwindCSS) de onboarding para Omnicom Production Latam.
El contenido por rol (skills `role` / `team` / `workflow` / `tools` / `tips`) se sirve como markdown estático desde `backend/mocks/*.json`.
OpenAI se usa **solo** para el chat libre, que tiene historial persistente en SQLite.

---

## 🏛 Arquitectura

```
┌──────────────────────────────────────────────────────────────────────┐
│                          Electron (main.js)                          │
│  ┌────────────────────┐         ┌────────────────────────────────┐   │
│  │  BrowserWindow     │ ←─IPC─→ │  Express backend (embebido)    │   │
│  │  (Renderer React)  │         │  - lee .env (OPENAI_API_KEY)   │   │
│  │  HashRouter        │         │  - catálogo desde mocks/*.json │   │
│  └─────────┬──────────┘         │  - chat → OpenAI               │   │
│            │                    └──────────────┬─────────────────┘   │
│            │ fetch http://127.0.0.1:PORT       │                     │
│            ↓                                   ↓                     │
│  ┌────────────────────┐         ┌────────────────────────────────┐   │
│  │  Vite dev (5173)   │         │  SQLite (better-sqlite3)       │   │
│  │  o dist/ en prod   │         │  historial_chat / sesiones     │   │
│  └────────────────────┘         └────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────────────┘

API key vive SOLO en backend Node. El frontend nunca la ve.
Las skills son markdown estático; OpenAI solo se invoca en /api/ai/chat.
```

---

## 📁 Estructura

```
op-onboarding/
├── .env.example
├── .gitignore
├── package.json
├── electron/
│   ├── main.js              # Proceso principal Electron
│   └── preload.js           # Bridge contextIsolation
├── backend/
│   ├── server.js            # Express embebido (127.0.0.1)
│   ├── routes/ai.js         # Endpoints REST
│   ├── services/
│   │   ├── roles.js         # Carga catálogo desde mocks/*.json
│   │   ├── prompts.js       # SYSTEM_PROMPT + buildChatPrompt
│   │   └── openai.js        # Cliente OpenAI + retry (solo chat)
│   ├── mocks/               # Fuente de verdad del catálogo
│   │   ├── automation.json
│   │   ├── desarrollo-digital.json
│   │   ├── financial-operations.json
│   │   ├── offshoring.json
│   │   ├── people.json
│   │   ├── produccion-audiovisual.json
│   │   ├── service.json
│   │   └── smart-studio.json
│   ├── db/
│   │   ├── index.js         # Conexión SQLite + migración legacy
│   │   └── schema.sql       # DDL (historial_chat, usuario_sesion)
│   └── utils/tokens.js      # Truncado de historial
└── frontend/
    ├── index.html
    ├── vite.config.js
    ├── tailwind.config.js   # Tokens OP Brand mapeados
    ├── postcss.config.js
    └── src/
        ├── main.jsx · App.jsx · router.jsx
        ├── api/client.js
        ├── components/
        │   ├── SplashScreen · RolePicker · DashboardCard
        │   ├── SkillView · ChatPanel
        │   └── ui/ (Button · TitleBar · Markdown · TextField · StepDots · ProgressDots ·
        │           BrandBadge · GradientOrb · AnimatedRings · GridPattern · NoiseOverlay)
        ├── pages/ (Welcome · IntroName · IntroTour · SelectRole · Dashboard · Chat)
        ├── hooks/useAI.js
        ├── store/useAppStore.js
        └── styles/index.css
```

---

## 🔄 Flujo de datos

### Skill estática (ejemplo: usuario abre la card "Mi Rol")

1. **Renderer** dispara `api.getSkill("role", role.slug)`.
2. **Cliente fetch** consulta a Electron preload el puerto del backend → `http://127.0.0.1:PORT`.
3. **POST `/api/ai/skill/role`** llega al Express embebido con body `{ roleSlug }`.
4. **Backend** valida la skill (`role` / `team` / `workflow` / `tools` / `tips`) y devuelve `role.skills[skill]` desde el catálogo en memoria cargado de `backend/mocks/*.json`. **No hay llamada a OpenAI** ni cache en SQLite para skills.
5. **`SkillView`** renderiza el markdown con react-markdown.

### Chat libre (única ruta que llama a OpenAI)

1. **Renderer** dispara `api.sendChat(roleSlug, message)` → **POST `/api/ai/chat`**.
2. **Backend** trunca el mensaje a 4000 chars, lee los últimos 20 mensajes de `historial_chat` (SQLite) y trunca el contexto con `truncateHistory`.
3. **`runChat`** construye `[SYSTEM_PROMPT, ...history, userPrompt]` → `client.chat.completions.create()` con retry exponencial (3 intentos, sin reintentos en 400/401).
4. **Respuesta** se persiste como par `user`/`assistant` en `historial_chat` dentro de una transacción.
5. **`ChatPanel`** renderiza la respuesta y refresca el historial.

---

## ⚙️ Instalación y ejecución

### Pre-requisitos
- **Node.js 20.x** o superior
- **npm 10+**
- **Windows 10/11** (target principal — también corre en macOS/Linux)
- API key de OpenAI

### Pasos

```bash
# 1) Instalar dependencias del root
npm install

# 2) Instalar dependencias del frontend
cd frontend && npm install && cd ..

# 3) Configurar variables de entorno
cp .env.example .env
# Edita .env y pega tu OPENAI_API_KEY

# 4) Levantar la app en modo dev (Vite + backend + Electron)
# El backend crea/migra automáticamente backend/db/op-onboarding.sqlite en el primer arranque.
# El catálogo se carga en memoria desde backend/mocks/*.json — no hay seed.
npm run dev
```

### Build de producción

```bash
npm run build           # genera frontend/dist + instalador NSIS para Windows
```

---

## 🔒 Seguridad

- `OPENAI_API_KEY` se lee **solo** desde `.env` en el proceso Node.
- `.env` está en `.gitignore`.
- Electron usa `contextIsolation: true` y `nodeIntegration: false`.
- Express escucha solo en `127.0.0.1` y permite CORS solo desde `localhost` y `file://`.
- Input del chat se trunca a 4000 chars antes de enviarse al modelo.

---

## 🛠 Troubleshooting

**"OPENAI_API_KEY no está definido"** — copia `.env.example` a `.env` y agrega tu key real.

**Vite no arranca / puerto 5173 ocupado** — ciérralo o cambia `vite.config.js`.

**`better-sqlite3` falla al instalar en Windows** — instala build tools:
`npm install --global windows-build-tools` (o `npm i -g node-gyp`).

**Electron muestra pantalla blanca** — en dev espera a que Vite arranque; en prod verifica que `frontend/dist/index.html` exista.

**Rate limit 429** — el retry exponencial maneja 3 intentos; espera 30s y reintenta.

---

## 🎨 Brand & Diseño

Tokens OP Brand Guideline mapeados a Tailwind (`frontend/tailwind.config.js`):
- Superficies `level_1` → `level_6` (dark canvas)
- `op_blue_600` (#4361EF) como CTA principal
- Fuente **Mulish** (Google Fonts)
- Motion: Shine Doctrine (glow `slow` 400ms + content `standard` 300ms)
- `prefers-reduced-motion` respetado en `styles/index.css`

---

## 🚀 Roadmap

- **SSO / Microsoft Entra ID** — login corporativo automático.
- **Backend remoto opcional** — sincronizar caché entre devices.
- **Multi-idioma** — i18n es/en (toggle en header).
- **Analytics** — % de cards completadas por rol, drop-off por sección.
- **Versionado de contenido** — admin puede editar el `SYSTEM_PROMPT` por equipo.
- **Modo offline real** — pre-genera todas las skills durante el primer arranque.
- **Embeddings + RAG** — adjuntar manuales internos en PDF y responder contra ellos.

---

## ✅ Checklist Windows desde cero

```
□ Instalar Node.js 20+ desde https://nodejs.org
□ git clone <repo> && cd op-onboarding
□ npm install
□ cd frontend && npm install && cd ..
□ copy .env.example .env
□ Pegar OPENAI_API_KEY real en .env
□ npm run dev
□ Aparece splash → selección de rol → dashboard
```
# OP-ONBORDING
