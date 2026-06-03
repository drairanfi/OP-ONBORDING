// Block: role-picker — selector de rol agrupado por área de OP Latam,
// con buscador en vivo y chat IA fallback ("no encuentro mi rol").

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "../api/client";
import BrandBadge from "./ui/BrandBadge.jsx";
import GradientOrb from "./ui/GradientOrb.jsx";
import GridPattern from "./ui/GridPattern.jsx";
import NoiseOverlay from "./ui/NoiseOverlay.jsx";
import Icon, { areaIconName } from "./ui/Icon.jsx";
import ChatPanel from "./ChatPanel.jsx";

// Labels de fallback cuando el rol llega sin areaLabel desde el backend.
const AREA_LABELS = {
  "automation": "Automation",
  "desarrollo-digital": "Desarrollo Digital",
  "financial-operations": "Financial & Operations",
  "offshoring": "Offshoring",
  "people": "People",
  "produccion-audiovisual": "Producción Audiovisual",
  "service": "Service",
  "smart-studio": "Smart Studio",
};

const EASE_PREMIUM  = [0.16, 1, 0.3, 1];
const EASE_STORY    = [0, 0, 0.58, 1];

function normalize(str) {
  return (str || "")
    .toString()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}

export default function RolePicker({ onSelect }) {
  const [roles, setRoles]       = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);
  const [selected, setSelected] = useState(null);
  const [query, setQuery]       = useState("");
  const [chatOpen, setChatOpen] = useState(false);

  const searchRef = useRef(null);

  useEffect(() => {
    api.getRoles()
      .then((d) => setRoles(d.roles))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  // Atajo: "/" para enfocar el buscador, "Esc" para limpiarlo o cerrar el chat.
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "/" && document.activeElement?.tagName !== "INPUT") {
        e.preventDefault();
        searchRef.current?.focus();
      } else if (e.key === "Escape") {
        if (chatOpen) setChatOpen(false);
        else if (query) setQuery("");
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [chatOpen, query]);

  const handleSelect = (role) => {
    setSelected(role.slug);
    setTimeout(() => onSelect(role), 360);
  };

  // Mouse-track para el glow radial en cada card
  const handleMouseMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    const mx = ((e.clientX - r.left) / r.width) * 100;
    const my = ((e.clientY - r.top)  / r.height) * 100;
    e.currentTarget.style.setProperty("--mx", `${mx}%`);
    e.currentTarget.style.setProperty("--my", `${my}%`);
  };

  // ── Filtrado en vivo ───────────────────────────────────────────────
  const q = normalize(query.trim());
  const filtered = useMemo(() => {
    if (!q) return roles;
    return roles.filter((r) => {
      const hay = [
        r.nombre,
        r.descripcion_corta,
        r.area,
        r.areaLabel,
        AREA_LABELS[r.area],
      ]
        .map(normalize)
        .join(" ");
      return hay.includes(q);
    });
  }, [roles, q]);

  if (loading) return <RolePickerSkeleton />;

  if (error) {
    return (
      <div className="role-picker__error">
        <div className="role-picker__error-box">⚠ {error}</div>
      </div>
    );
  }

  const areas  = [...new Set(roles.map((r) => r.area))];
  const counts = roles.reduce((acc, r) => ({ ...acc, [r.area]: (acc[r.area] || 0) + 1 }), {});
  const visibleAreas = areas.filter((a) => filtered.some((r) => r.area === a));

  return (
    <div className="role-picker">
      {/* Fondo atmosférico */}
      <div className="role-picker__bg">
        <GradientOrb size={520} color="#2C40E4" intensity={0.30} blur={120}
                     className="-top-32 -left-32" />
        <GradientOrb size={460} color="#6689F4" intensity={0.22} blur={110}
                     className="top-1/3 -right-40" delay={2} />
        <GradientOrb size={400} color="#4361EF" intensity={0.18} blur={100}
                     className="-bottom-40 left-1/3" delay={4} />
        <GridPattern size={56} opacity={0.04} />
        <NoiseOverlay opacity={0.025} fixed={false} />
      </div>

      <div className="role-picker__container">

        {/* ── Header ─────────────────────────────────── */}
        <motion.header
          className="role-picker__header"
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE_PREMIUM }}
        >
          <div className="role-picker__eyebrow">
            <BrandBadge size="md" label="OMNICOM PRODUCTION" suffix="Onboarding" />
          </div>

          <motion.h1
            className="role-picker__title"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: EASE_PREMIUM }}
          >
            ¿Cuál es tu <span className="role-picker__title-em">rol</span>?
          </motion.h1>

          <motion.p
            className="role-picker__lead"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25, ease: EASE_PREMIUM }}
          >
            Selecciona tu posición y personalizaremos toda tu experiencia
            de onboarding con IA — del equipo a las herramientas, pasando
            por el flujo creativo de OP Latam.
          </motion.p>

          <motion.div
            className="role-picker__stats"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.45 }}
          >
            <Stat value={roles.length} label="Roles disponibles" />
            <span className="role-picker__stat-divider" />
            <Stat value={areas.length} label="Áreas creativas" />
            <span className="role-picker__stat-divider" />
            <Stat value="IA" label="Personalización" />
          </motion.div>
        </motion.header>

        {/* ── Search bar (sticky) ────────────────────── */}
        <motion.div
          className="role-picker__search-row"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.35, ease: EASE_PREMIUM }}
        >
          <div className={`role-picker__search ${query ? "role-picker__search--active" : ""}`}>
            <span className="role-picker__search-icon" aria-hidden>
              <Icon name="search" size={18} />
            </span>
            <input
              ref={searchRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Busca por rol, área o palabra clave…"
              className="role-picker__search-input"
              aria-label="Buscar rol"
            />
            {query ? (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="role-picker__search-clear"
                aria-label="Limpiar búsqueda"
              >
                <Icon name="close" size={12} />
              </button>
            ) : (
              <kbd className="role-picker__search-kbd" aria-hidden>/</kbd>
            )}
          </div>

          <button
            type="button"
            onClick={() => setChatOpen(true)}
            className="role-picker__ask-ai"
          >
            <span className="role-picker__ask-ai-icon">
              <Icon name="ai-chat" size={18} />
            </span>
            <span className="role-picker__ask-ai-text">
              <strong>¿No encuentras tu rol?</strong>
              <span>Pregúntale a la IA</span>
            </span>
          </button>
        </motion.div>

        {query && (
          <div className="role-picker__search-meta">
            {filtered.length === 0
              ? <>Sin coincidencias para <em>"{query}"</em></>
              : <>{filtered.length} {filtered.length === 1 ? "rol coincide" : "roles coinciden"} con <em>"{query}"</em></>}
          </div>
        )}

        {/* ── Empty state ─────────────────────────────── */}
        {query && filtered.length === 0 && (
          <motion.div
            className="role-picker__empty"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: EASE_PREMIUM }}
          >
            <div className="role-picker__empty-icon">
              <Icon name="search" size={26} />
            </div>
            <h3 className="role-picker__empty-title">No encontramos tu rol</h3>
            <p className="role-picker__empty-desc">
              Probá con otra palabra o describele tu cargo al asistente de IA — te
              ayuda a ubicarlo dentro de OP Latam.
            </p>
            <div className="role-picker__empty-actions">
              <button className="role-picker__empty-btn" onClick={() => setChatOpen(true)}>
                <Icon name="ai-chat" size={16} /> Hablar con la IA
              </button>
              <button className="role-picker__empty-btn role-picker__empty-btn--ghost" onClick={() => setQuery("")}>
                <Icon name="refresh" size={14} /> Limpiar búsqueda
              </button>
            </div>
          </motion.div>
        )}

        {/* ── Áreas ──────────────────────────────────── */}
        {visibleAreas.map((area, areaIdx) => {
          const areaRoles = filtered.filter((r) => r.area === area);
          const label = areaRoles[0]?.areaLabel || AREA_LABELS[area] || area;
          return (
            <motion.section
              key={area}
              className="role-picker__area"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.5 + areaIdx * 0.08, ease: EASE_STORY }}
            >
              <div className="role-picker__area-header">
                <div className="role-picker__area-icon">
                  <Icon name={areaIconName(area)} size={22} />
                </div>
                <h2 className="role-picker__area-title">{label}</h2>
                <span className="role-picker__area-count">
                  {q ? `${areaRoles.length} / ${counts[area]}` : `${counts[area]} roles`}
                </span>
                <span className="role-picker__area-line" />
              </div>

              <div className="role-picker__grid">
                {areaRoles.map((role, i) => (
                    <motion.button
                      key={role.slug}
                      onClick={() => handleSelect(role)}
                      onMouseMove={handleMouseMove}
                      className={`role-card ${selected === role.slug ? "role-card--selected" : ""}`}
                      initial={{ opacity: 0, y: 20, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{
                        duration: 0.45,
                        delay: 0.55 + areaIdx * 0.08 + i * 0.05,
                        ease: EASE_PREMIUM,
                      }}
                      whileHover={{ y: -4 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <span className="role-card__accent" />

                      <div className="role-card__icon-wrap">
                        <Icon name={areaIconName(role.area)} size={26} />
                      </div>
                      <h3 className="role-card__name">
                        <Highlight text={role.nombre} query={q} />
                      </h3>
                      <p className="role-card__desc">
                        <Highlight
                          text={role.descripcion_corta || "Tu rol clave en el equipo creativo de OP Latam."}
                          query={q}
                        />
                      </p>

                      <div className="role-card__footer">
                        <span className="role-card__cta">
                          Comenzar
                          <span className="role-card__cta-arrow">
                            <Icon name="arrow-right" size={14} />
                          </span>
                        </span>
                        <span className="role-card__check">
                          <Icon name="check" size={12} />
                        </span>
                      </div>
                    </motion.button>
                  ))}
              </div>
            </motion.section>
          );
        })}
      </div>

      {/* ── Drawer chat IA (modo guest) ──────────────── */}
      <AnimatePresence>
        {chatOpen && (
          <>
            <motion.div
              key="chat-backdrop"
              className="role-picker__chat-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setChatOpen(false)}
            />
            <motion.aside
              key="chat-drawer"
              className="role-picker__chat-drawer"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 40 }}
              transition={{ duration: 0.35, ease: EASE_PREMIUM }}
              role="dialog"
              aria-label="Asistente de IA"
            >
              <header className="role-picker__chat-head">
                <div className="role-picker__chat-head-title">
                  <span className="role-picker__chat-head-icon">
                    <Icon name="ai-chat" size={18} />
                  </span>
                  <div>
                    <h3>Asistente OP Latam</h3>
                    <p>Te ayudo a ubicar tu rol o resolver dudas generales.</p>
                  </div>
                </div>
                <button
                  className="role-picker__chat-close"
                  onClick={() => setChatOpen(false)}
                  aria-label="Cerrar"
                >
                  <Icon name="close" size={14} />
                </button>
              </header>
              <div className="role-picker__chat-body">
                <ChatPanel role={null} />
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

// Resalta el match dentro del texto sin reventar la tipografía base.
function Highlight({ text, query }) {
  if (!query) return text;
  const norm = normalize(text);
  const idx = norm.indexOf(query);
  if (idx === -1) return text;
  return (
    <>
      {text.slice(0, idx)}
      <mark className="role-card__mark">{text.slice(idx, idx + query.length)}</mark>
      {text.slice(idx + query.length)}
    </>
  );
}

function Stat({ value, label }) {
  return (
    <div className="role-picker__stat">
      <span className="role-picker__stat-value">{value}</span>
      <span className="role-picker__stat-label">{label}</span>
    </div>
  );
}

function RolePickerSkeleton() {
  return (
    <div className="role-picker">
      <div className="role-picker__container">
        <div className="role-picker__skeleton-title" />
        <div className="role-picker__skeleton-lead" />
        {[1, 2].map((i) => (
          <div key={i} className="role-picker__area">
            <div className="role-picker__skeleton-label" />
            <div className="role-picker__skeleton-grid">
              {[1, 2, 3, 4].map((j) => (
                <div key={j} className="role-picker__skeleton-card" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
