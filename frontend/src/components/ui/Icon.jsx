// Block: icon — biblioteca de SVGs propios, dibujados línea a línea, con
// significado de trabajo / área / acción. Todos heredan color con `currentColor`
// y usan viewBox 24x24 para escalar limpio en cualquier tamaño.

const STROKE = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

const PATHS = {
  // ── ÁREAS (mocks reales) ─────────────────────────────────────────
  // Automation: engranaje + chispa de circuito
  "area-automation": (
    <g {...STROKE}>
      <circle cx="9" cy="12" r="3.2" />
      <path d="M9 5.4V3.5M9 20.5v-1.9M3.5 12H1.6M16.4 12h1.9M5.2 8.2 3.9 6.9M12.8 15.8l1.3 1.3M5.2 15.8 3.9 17.1M12.8 8.2l1.3-1.3" />
      <path d="M16 7l1.4 2.3L20 10l-2.1 1.6.7 2.6L16 12.8l-2.6 1.4.7-2.6L12 10l2.6-.7L16 7Z" />
    </g>
  ),

  // Desarrollo Digital: corchetes de código con cursor
  "area-desarrollo-digital": (
    <g {...STROKE}>
      <path d="M9 7 4 12l5 5M15 7l5 5-5 5" />
      <path d="M13.4 5.5 10.6 18.5" />
    </g>
  ),

  // Financial & Operations: gráfico de barras ascendente con moneda
  "area-financial-operations": (
    <g {...STROKE}>
      <path d="M3.5 20.5h17" />
      <rect x="5"  y="13" width="2.6" height="6.5" rx="0.6" />
      <rect x="9.4" y="9"  width="2.6" height="10.5" rx="0.6" />
      <rect x="13.8" y="11" width="2.6" height="8.5" rx="0.6" />
      <circle cx="19" cy="6" r="2.6" />
      <path d="M19 4.6v2.8M17.8 6h2.4" />
    </g>
  ),

  // Offshoring: globo con flecha conectando hemisferios
  "area-offshoring": (
    <g {...STROKE}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M3.5 12h17" />
      <path d="M12 3.5c2.4 2.4 3.6 5.4 3.6 8.5s-1.2 6.1-3.6 8.5c-2.4-2.4-3.6-5.4-3.6-8.5S9.6 5.9 12 3.5Z" />
      <path d="m15.5 8.5 2 2-2 2" />
      <path d="M5.5 15.5h12" strokeDasharray="1 2" />
    </g>
  ),

  // People: cabeza + corazón pequeño (HR)
  "area-people": (
    <g {...STROKE}>
      <circle cx="9.5" cy="8.5" r="3" />
      <path d="M3.5 19.5c0-3.3 2.7-6 6-6s6 2.7 6 6" />
      <path d="M17.8 5.4c1.1-.9 2.7-.7 3.4.4.7 1.1.4 2.5-.6 3.4l-2.8 2.5-2.8-2.5c-1-.9-1.3-2.3-.6-3.4.7-1.1 2.3-1.3 3.4-.4Z" />
    </g>
  ),

  // Producción Audiovisual: cámara de video + claqueta
  "area-produccion-audiovisual": (
    <g {...STROKE}>
      <rect x="2.5" y="8" width="13" height="9" rx="1.4" />
      <path d="m15.5 11 5-2.5v7l-5-2.5z" />
      <circle cx="6.5" cy="12.5" r="1.4" />
      <path d="M3 4.5h13l-2 2H5L3 4.5Z" />
    </g>
  ),

  // Service: headset (atención al cliente) + onda
  "area-service": (
    <g {...STROKE}>
      <path d="M4 13v-1a8 8 0 0 1 16 0v1" />
      <rect x="3" y="13" width="3.5" height="6" rx="1.4" />
      <rect x="17.5" y="13" width="3.5" height="6" rx="1.4" />
      <path d="M19.2 19v.7c0 1.1-.9 2-2 2h-2.7" />
      <circle cx="12" cy="21.7" r="0.9" />
    </g>
  ),

  // Smart Studio: paleta + pincel
  "area-smart-studio": (
    <g {...STROKE}>
      <path d="M11.5 3.5c4.7 0 8.5 3.4 8.5 7.5 0 1.8-1.5 3-3.3 3h-1.6c-1 0-1.6 1-1.1 1.9.6 1.1-.2 2.6-1.5 2.6-4.7 0-8.5-3.4-8.5-7.5s3.8-7.5 7.5-7.5Z" />
      <circle cx="8.2"  cy="9"   r="0.9" />
      <circle cx="12"   cy="6.8" r="0.9" />
      <circle cx="15.5" cy="9"   r="0.9" />
      <circle cx="8.5"  cy="13"  r="0.9" />
    </g>
  ),

  // Fallback para áreas no mapeadas
  "area-default": (
    <g {...STROKE}>
      <path d="M12 3.2 21 8v8l-9 4.8L3 16V8l9-4.8Z" />
      <path d="M3 8l9 4.8M21 8l-9 4.8M12 12.8v8" />
    </g>
  ),

  // ── SKILLS (Dashboard) ───────────────────────────────────────────
  // Mi Rol: badge identificador
  "skill-role": (
    <g {...STROKE}>
      <rect x="3.5" y="4" width="17" height="16" rx="2" />
      <circle cx="9.5" cy="10" r="2.4" />
      <path d="M5.5 16.5c.5-1.7 2.1-2.9 4-2.9s3.5 1.2 4 2.9" />
      <path d="M14.5 9h4.5M14.5 12h3" />
    </g>
  ),

  // Mi Equipo: tres siluetas conectadas
  "skill-team": (
    <g {...STROKE}>
      <circle cx="12" cy="7" r="2.6" />
      <circle cx="5.5" cy="9.5" r="2.2" />
      <circle cx="18.5" cy="9.5" r="2.2" />
      <path d="M7.5 19.5c0-2.5 2-4.5 4.5-4.5s4.5 2 4.5 4.5" />
      <path d="M2 18.5c0-2 1.6-3.6 3.5-3.6" />
      <path d="M22 18.5c0-2-1.6-3.6-3.5-3.6" />
    </g>
  ),

  // Workflow: nodos de proceso con flechas
  "skill-workflow": (
    <g {...STROKE}>
      <rect x="2.5" y="4"  width="6" height="5" rx="1" />
      <rect x="15.5" y="4"  width="6" height="5" rx="1" />
      <rect x="2.5" y="15" width="6" height="5" rx="1" />
      <rect x="15.5" y="15" width="6" height="5" rx="1" />
      <path d="M8.5 6.5h7M8.5 17.5h7" />
      <path d="M5.5 9v6M18.5 9v6" />
      <path d="m13.5 6.5 2 0M13.5 17.5l2 0M5.5 14l0 1M18.5 14l0 1" />
    </g>
  ),

  // Tools: llave + destornillador cruzados
  "skill-tools": (
    <g {...STROKE}>
      <path d="m14.5 5 4.5 4.5-2 2L17 13l-1.5 1.5-2-2-7.7 7.7c-.6.6-1.6.6-2.3 0s-.6-1.6 0-2.3l7.7-7.7-2-2L13 6.5 14.5 5l0 0Z" />
      <path d="m5 4.5 4 1.5 1.5 4-2 2L4.5 10 3 6l2-1.5Z" />
    </g>
  ),

  // Esenciales: llave (acceso / SSO) sobre tarjeta
  "skill-esenciales": (
    <g {...STROKE}>
      <circle cx="8" cy="12" r="3.2" />
      <path d="M11.2 12h8.3M16.5 12v2.5M19 12v3" />
      <circle cx="8" cy="12" r="0.9" fill="currentColor" stroke="none" />
    </g>
  ),

  // Tips / 90 días: bombilla con destello
  "skill-tips": (
    <g {...STROKE}>
      <path d="M12 3.5c-3.3 0-6 2.6-6 5.9 0 2.2 1.2 4.1 3 5v2.4c0 .6.4 1 1 1h4c.6 0 1-.4 1-1V14.4c1.8-1 3-2.9 3-5 0-3.3-2.7-5.9-6-5.9Z" />
      <path d="M10 20h4M10.5 22h3" />
      <path d="M12 8v3.5M10.5 10l3 0" />
    </g>
  ),

  // ── TOUR (intro slides) ──────────────────────────────────────────
  // Quiénes somos: edificio corporativo
  "tour-company": (
    <g {...STROKE}>
      <path d="M3.5 20.5h17" />
      <path d="M5 20.5V7l7-3 7 3v13.5" />
      <path d="M9.5 11h2M12.5 11h2M9.5 14h2M12.5 14h2M9.5 17h2M12.5 17h2" />
      <path d="M11 20.5v-3h2v3" />
    </g>
  ),

  // Cómo trabajamos: nodos conectados (red de equipos)
  "tour-teamwork": (
    <g {...STROKE}>
      <circle cx="12" cy="5" r="2" />
      <circle cx="5" cy="12" r="2" />
      <circle cx="19" cy="12" r="2" />
      <circle cx="8.5" cy="19" r="2" />
      <circle cx="15.5" cy="19" r="2" />
      <path d="m10.5 6 -4 4.5M13.5 6l4 4.5M6.5 13.5l1.5 4M17.5 13.5l-1.5 4M10.5 19h3" />
    </g>
  ),

  // Proceso: ruta del brief al delivery (flecha con waypoints)
  "tour-process": (
    <g {...STROKE}>
      <circle cx="4" cy="6" r="1.6" />
      <circle cx="11" cy="12" r="1.6" />
      <circle cx="18" cy="18" r="1.6" />
      <path d="M5.4 7 9.6 11M12.4 13l4.2 4" />
      <path d="m18.5 6 2 1.5-2 1.5z" transform="rotate(45 19 7.5)" />
    </g>
  ),

  // Onboarding IA: chip / cerebro con destello
  "tour-ai": (
    <g {...STROKE}>
      <rect x="6" y="6" width="12" height="12" rx="2.5" />
      <path d="M9 9.5h6v5h-6z" />
      <path d="M9 3v3M15 3v3M9 18v3M15 18v3M3 9h3M3 15h3M18 9h3M18 15h3" />
      <path d="m13 4 .8 1.3L15 6l-1.2.8L13 8l-.8-1.3L11 6l1.2-.7L13 4Z" />
    </g>
  ),

  // ── UI / ACCIONES ────────────────────────────────────────────────
  // Buscador
  "search": (
    <g {...STROKE}>
      <circle cx="10.5" cy="10.5" r="6" />
      <path d="m15.2 15.2 5 5" />
    </g>
  ),

  // Cerrar (X)
  "close": (
    <g {...STROKE}>
      <path d="M5.5 5.5l13 13M18.5 5.5l-13 13" />
    </g>
  ),

  // Checkmark
  "check": (
    <g {...STROKE}>
      <path d="m5 12.5 4.5 4.5L19 7" />
    </g>
  ),

  // Flecha derecha
  "arrow-right": (
    <g {...STROKE}>
      <path d="M4 12h16M14 6l6 6-6 6" />
    </g>
  ),

  // Flecha izquierda
  "arrow-left": (
    <g {...STROKE}>
      <path d="M20 12H4M10 6l-6 6 6 6" />
    </g>
  ),

  // Enviar (avión de papel)
  "send": (
    <g {...STROKE}>
      <path d="M21 3 3 11l7.5 2.5L13 21l8-18Z" />
      <path d="M10.5 13.5 21 3" />
    </g>
  ),

  // Volver / restaurar
  "back": (
    <g {...STROKE}>
      <path d="M9 5 4 10l5 5" />
      <path d="M4 10h9.5c3.6 0 6.5 2.9 6.5 6.5v1" />
    </g>
  ),

  // Refrescar / regenerar
  "refresh": (
    <g {...STROKE}>
      <path d="M20 12a8 8 0 1 1-2.4-5.7" />
      <path d="M20 4v4h-4" />
    </g>
  ),

  // Chat IA: burbuja con destello
  "ai-chat": (
    <g {...STROKE}>
      <path d="M3.5 6.5c0-1.1.9-2 2-2h13c1.1 0 2 .9 2 2v9c0 1.1-.9 2-2 2H10.5l-4 3.5v-3.5H5.5c-1.1 0-2-.9-2-2v-9Z" />
      <path d="m13 8.5.9 1.9 1.9.9-1.9.9-.9 1.9-.9-1.9-1.9-.9 1.9-.9.9-1.9Z" />
    </g>
  ),

  // Avatar / IA (genérico para burbuja del asistente)
  "ai-avatar": (
    <g {...STROKE}>
      <circle cx="12" cy="12" r="8.5" />
      <circle cx="9.5" cy="11" r="1.2" />
      <circle cx="14.5" cy="11" r="1.2" />
      <path d="M9 15.5c.8.9 1.9 1.5 3 1.5s2.2-.6 3-1.5" />
      <path d="m17 4 .6 1.4L19 6l-1.4.6L17 8l-.6-1.4L15 6l1.4-.6L17 4Z" />
    </g>
  ),

  // Sparkle / IA (decorativo)
  "spark": (
    <g {...STROKE}>
      <path d="m12 3 1.6 4.8 4.8 1.6-4.8 1.6L12 16l-1.6-5L5.6 9.4 10.4 7.8 12 3Z" />
      <path d="m19 15 .9 1.6 1.6.9-1.6.9-.9 1.6-.9-1.6-1.6-.9 1.6-.9.9-1.6Z" />
    </g>
  ),

  // Brand / logo OP (rombo segmentado)
  "brand": (
    <g {...STROKE}>
      <path d="M12 3.2 20.8 12 12 20.8 3.2 12 12 3.2Z" />
      <path d="M12 3.2v17.6M3.2 12h17.6" />
      <circle cx="12" cy="12" r="2.4" fill="currentColor" stroke="none" />
    </g>
  ),

  // Cambiar rol (flecha en U)
  "switch": (
    <g {...STROKE}>
      <path d="M4 8h11c2.2 0 4 1.8 4 4s-1.8 4-4 4H8" />
      <path d="m8 12-3 4 3 4M7 4 4 8l3 4" />
    </g>
  ),

  // Window controls (Electron)
  "window-min": (
    <g {...STROKE}>
      <path d="M5 12h14" />
    </g>
  ),
  "window-max": (
    <g {...STROKE}>
      <rect x="5" y="5" width="14" height="14" rx="1" />
    </g>
  ),
  "window-close": (
    <g {...STROKE}>
      <path d="M6 6l12 12M18 6 6 18" />
    </g>
  ),
};

export default function Icon({ name, size = 20, className = "", strokeWidth, title, ...rest }) {
  const body = PATHS[name] || PATHS["area-default"];

  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      role={title ? "img" : "presentation"}
      aria-hidden={title ? undefined : true}
      aria-label={title}
      focusable="false"
      className={className}
      style={strokeWidth ? { strokeWidth } : undefined}
      {...rest}
    >
      {title && <title>{title}</title>}
      {body}
    </svg>
  );
}

// Resolver auxiliar para áreas (acepta el slug del mock y devuelve el nombre del SVG).
export function areaIconName(area) {
  const map = {
    "automation": "area-automation",
    "desarrollo-digital": "area-desarrollo-digital",
    "financial-operations": "area-financial-operations",
    "offshoring": "area-offshoring",
    "people": "area-people",
    "produccion-audiovisual": "area-produccion-audiovisual",
    "service": "area-service",
    "smart-studio": "area-smart-studio",
  };
  return map[area] || "area-default";
}
