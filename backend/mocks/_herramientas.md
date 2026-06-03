{{INTRO}}
## Cómo accedes a tus herramientas

### Self Service — tu app store interna
La mayoría del software corporativo se instala desde **Self Service**, un app desktop que ya viene en tu equipo de OP. Ahí encuentras todo lo aprobado por IT — desde herramientas de trabajo hasta apps de día a día (Spotify, navegadores, lectores de PDF, comunicación).

**Cómo usarlo:**
- Abre **Self Service** desde el Launchpad o el menú de aplicaciones.
- Busca la app que necesitas y dale **Install** — la instalación es automática, sin contraseñas de admin.
- Si no la encuentras o necesitas una licencia, escríbele a tu manager o levanta un ticket por **911**.

> Lo que no esté en Self Service o requiera licencia paga se gestiona vía IT. **No descargues software por fuera del canal oficial** — es la regla más fácil de cumplir y la que más dolores de cabeza evita.

### Homebrew — para todo lo que vive en la terminal (macOS)
Si tu rol es técnico (devs, automation, motion con scripts), muchas herramientas de línea de comandos no están en Self Service y se instalan con **[Homebrew](https://brew.sh/)** — el gestor de paquetes estándar de macOS.

```bash
# Instalación (una sola vez)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Ejemplos típicos
brew install node git gh docker wget jq
```

> En Windows el equivalente es **[winget](https://learn.microsoft.com/windows/package-manager/winget/)** (preinstalado en Windows 11) o **[Chocolatey](https://chocolatey.org/)**.

---

{{AREA:desarrollo-digital}}
## Herramientas — Desarrollo Digital

### Editor y entorno local
- **[Visual Studio Code](https://code.visualstudio.com/)** — editor principal. Configura extensiones del stack (ESLint, Prettier, GitLens, lenguaje correspondiente, Tailwind IntelliSense).
- **[Node.js](https://nodejs.org/)** + **[npm](https://www.npmjs.com/)** / **[pnpm](https://pnpm.io/)** / **[Yarn](https://yarnpkg.com/)** — runtime y gestores de paquetes (instálalos con `brew install node pnpm`).
- **[Docker Desktop](https://www.docker.com/products/docker-desktop/)** — contenedores y bases de datos locales.
- **[Git](https://git-scm.com/)** + cliente visual: **[GitHub Desktop](https://desktop.github.com/)**, **[Sourcetree](https://www.sourcetreeapp.com/)** o **[Fork](https://git-fork.com/)** si prefieres GUI sobre CLI.
- **[GitHub CLI (`gh`)](https://cli.github.com/)** — para gestionar PRs y repos desde terminal.

### Lenguajes y frameworks típicos
- **Frontend:** [React](https://react.dev/) / [Next.js](https://nextjs.org/), [Vue](https://vuejs.org/), [Tailwind](https://tailwindcss.com/), [Vite](https://vitejs.dev/).
- **Backend:** [Node.js](https://nodejs.org/), [Python](https://www.python.org/) ([Django](https://www.djangoproject.com/)), [PHP](https://www.php.net/) — depende del proyecto.
- **Bases de datos:** [PostgreSQL](https://www.postgresql.org/), [MySQL](https://www.mysql.com/), [MongoDB](https://www.mongodb.com/).

### Pruebas y debugging
- **[Postman](https://www.postman.com/)** o **[Insomnia](https://insomnia.rest/)** — para probar APIs.
- **[Chrome DevTools](https://developer.chrome.com/docs/devtools/)** y **[React DevTools](https://react.dev/learn/react-developer-tools)** — debugging del frontend.
- **[Jest](https://jestjs.io/)**, **[Cypress](https://www.cypress.io/)** o **[Playwright](https://playwright.dev/)** — testing automatizado.

### Diseño y handoff
- **[Figma](https://www.figma.com/)** — para revisar mocks y exportar assets.
- **[Adobe XD](https://www.adobe.com/products/xd.html)** — en algunos proyectos legacy.

### Comunicación y gestión
- **Microsoft Teams**, **Jira**, **CoR** — ya cubiertos en *Esenciales*.

---

{{AREA:produccion-audiovisual}}
## Herramientas — Producción Audiovisual

### Edición y postproducción
- **[Adobe Premiere Pro](https://www.adobe.com/products/premiere.html)** — edición principal.
- **[Adobe After Effects](https://www.adobe.com/products/aftereffects.html)** — motion graphics y composición.
- **[DaVinci Resolve](https://www.blackmagicdesign.com/products/davinciresolve)** — corrección de color y edición avanzada.
- **[Avid Media Composer](https://www.avid.com/media-composer)** — en proyectos broadcast.

### Audio
- **[Adobe Audition](https://www.adobe.com/products/audition.html)** o **[Pro Tools](https://www.avid.com/pro-tools)** — mezcla y limpieza de sonido.

### 3D y VFX
- **[Cinema 4D](https://www.maxon.net/en/cinema-4d)**, **[Blender](https://www.blender.org/)**, **[Maya](https://www.autodesk.com/products/maya/overview)** — según el proyecto.

### Diseño y assets
- **[Adobe Photoshop](https://www.adobe.com/products/photoshop.html)** e **[Illustrator](https://www.adobe.com/products/illustrator.html)** — grafismos, storyboards, piezas estáticas.

### Revisión y delivery
- **[Frame.io](https://frame.io/)** — revisión con clientes y aprobaciones.
- **CoR**, **Jira**, **Microsoft Teams** — ya cubiertos en *Esenciales*.

---

{{AREA:smart-studio}}
## Herramientas — Smart Studio

### Diseño
- **[Adobe Photoshop](https://www.adobe.com/products/photoshop.html)**, **[Illustrator](https://www.adobe.com/products/illustrator.html)**, **[InDesign](https://www.adobe.com/products/indesign.html)** — paquete creativo completo.
- **[Figma](https://www.figma.com/)** — diseño digital colaborativo.

### Copywriting
- **[Google Docs](https://docs.google.com/)** / **[Microsoft Word](https://www.microsoft.com/en-us/microsoft-365/word)** — redacción y revisión.
- Herramientas de revisión gramatical y de estilo cuando aplique.

### Producción gráfica
- **[Adobe Bridge](https://www.adobe.com/products/bridge.html)** — organización de assets.
- **[Adobe Acrobat Pro](https://www.adobe.com/acrobat/acrobat-pro.html)** — revisión de PDFs y artes finales.

### Comunicación y gestión
- **Microsoft Teams**, **CoR**, **Jira** — ya cubiertos en *Esenciales*.

---

{{AREA:automation}}
## Herramientas — Automation

### Diseño y motion
- **[Figma](https://www.figma.com/)** — sistemas y componentes reutilizables.
- **[Adobe After Effects](https://www.adobe.com/products/aftereffects.html)**, **[Photoshop](https://www.adobe.com/products/photoshop.html)**, **[Illustrator](https://www.adobe.com/products/illustrator.html)** — piezas y animaciones.

### Código y automatización
- **[Visual Studio Code](https://code.visualstudio.com/)** — editor principal.
- **[Node.js](https://nodejs.org/)** + **[npm](https://www.npmjs.com/)** — para scripts, plugins y pipelines (instala con `brew install node`).
- **[Git](https://git-scm.com/)** — control de versiones de los scripts y plantillas.

### Comunicación y gestión
- **Microsoft Teams**, **Jira**, **CoR** — ya cubiertos en *Esenciales*.

---

{{AREA:offshoring}}
## Herramientas — Offshoring

Las herramientas dependen mucho del rol específico (editor, retoucher, producer, motion designer, etc.), pero los pilares comunes son:

### Creativas
- **[Adobe Creative Cloud](https://www.adobe.com/creativecloud.html)** completa — [Photoshop](https://www.adobe.com/products/photoshop.html), [Illustrator](https://www.adobe.com/products/illustrator.html), [Premiere](https://www.adobe.com/products/premiere.html), [After Effects](https://www.adobe.com/products/aftereffects.html), [InDesign](https://www.adobe.com/products/indesign.html).
- **[Capture One](https://www.captureone.com/)** — para retoque fotográfico avanzado.
- **[Cinema 4D](https://www.maxon.net/en/cinema-4d)** o **[Maya](https://www.autodesk.com/products/maya/overview)** — proyectos con 3D.

### Revisión y delivery
- **[Frame.io](https://frame.io/)** — revisión con clientes en audiovisual.
- **[Adobe Acrobat Pro](https://www.adobe.com/acrobat/acrobat-pro.html)** — revisión de artes y entregas en PDF.

### Gestión y comunicación
- **CoR**, **Jira**, **Microsoft Teams** — ya cubiertos en *Esenciales*.

---

{{AREA:financial-operations}}
## Herramientas — Financial & Operations

### Hojas de cálculo y reportes
- **[Microsoft Excel](https://www.microsoft.com/en-us/microsoft-365/excel)** — análisis financiero, modelos, proyecciones.
- **[Google Sheets](https://sheets.google.com/)** — colaboración en tiempo real con stakeholders.

### ERP y administración
- **ERP corporativo** — confirma con tu manager el sistema vigente ([SAP](https://www.sap.com/), [NetSuite](https://www.netsuite.com/) u otro).
- **[BambooHR](https://www.bamboohr.com/)** — para todo lo ligado a información del talento.

### Comunicación
- **[Microsoft Teams](https://www.microsoft.com/en-us/microsoft-teams)** y **[Outlook](https://www.microsoft.com/en-us/microsoft-365/outlook)** — comunicación interna y con proveedores.

---

{{AREA:people}}
## Herramientas — People

### Gestión de talento
- **[BambooHR](https://www.bamboohr.com/)** — información de colaboradores, contratos, evaluaciones, vacaciones.
- **[LinkedIn Recruiter](https://business.linkedin.com/talent-solutions/recruiter)** — búsqueda activa de candidatos.

### Comunicación
- **[Microsoft Teams](https://www.microsoft.com/en-us/microsoft-teams)** y **[Outlook](https://www.microsoft.com/en-us/microsoft-365/outlook)** — comunicación interna del día a día.
- **Calendario** ([Outlook](https://outlook.live.com/calendar/) / [Google Calendar](https://calendar.google.com/)) — entrevistas, 1:1s y agendamientos.

### Documentos y procesos
- **[Google Workspace](https://workspace.google.com/)** / **[Microsoft 365](https://www.microsoft.com/en-us/microsoft-365)** — políticas, formularios y plantillas.

---

{{AREA:service}}
## Herramientas — Service

### Coordinación de cuentas y proyectos
- **[CoR](https://cor.works/)** — gestión de cuentas, proyectos y tiempos.
- **[Jira](https://www.atlassian.com/software/jira)** — seguimiento de actividades del equipo entregable.

### Comunicación
- **[Microsoft Teams](https://www.microsoft.com/en-us/microsoft-teams)** — interna y con clientes.
- **[Outlook](https://www.microsoft.com/en-us/microsoft-365/outlook)** — comunicación formal y agendamiento.

### Documentos y presentaciones
- **[PowerPoint](https://www.microsoft.com/en-us/microsoft-365/powerpoint)** / **[Keynote](https://www.apple.com/keynote/)** — presentaciones a clientes.
- **[Adobe Acrobat Pro](https://www.adobe.com/acrobat/acrobat-pro.html)** — revisión y entrega de documentos.

---

{{AREA:default}}
## Herramientas

Las herramientas específicas dependen de tu rol. Las que tienes garantizadas desde el día uno son:

- **[Microsoft Teams](https://www.microsoft.com/en-us/microsoft-teams)** — comunicación interna y reuniones.
- **[CoR](https://cor.works/)** — gestión de proyectos y tiempos.
- **[Jira](https://www.atlassian.com/software/jira)** — seguimiento de actividades (cuando aplique).
- **[BambooHR](https://www.bamboohr.com/)** — tu información de talento.
- **Self Service** — para instalar el resto del software aprobado.

Si tu rol necesita herramientas específicas que no encuentras en Self Service, coordínalo con tu manager.
