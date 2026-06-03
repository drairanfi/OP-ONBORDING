// Block: dashboard — hero + stats + 5 cards de skill + panel inline (skill o chat).

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

import { useAppStore } from "../store/useAppStore.js";
import { useSkillContent } from "../hooks/useAI.js";
import DashboardCard from "../components/DashboardCard.jsx";
import SkillView from "../components/SkillView.jsx";
import ChatPanel from "../components/ChatPanel.jsx";
import FeedbackModal from "../components/FeedbackModal.jsx";
import Button from "../components/ui/Button.jsx";
import BrandBadge from "../components/ui/BrandBadge.jsx";
import GradientOrb from "../components/ui/GradientOrb.jsx";
import GridPattern from "../components/ui/GridPattern.jsx";
import NoiseOverlay from "../components/ui/NoiseOverlay.jsx";
import Icon from "../components/ui/Icon.jsx";

const CARDS = [
  { key: "role",       label: "Mi Rol",           iconName: "skill-role",     desc: "Tu función en el equipo, responsabilidades clave y cómo encajas en el flow." },
  { key: "team",       label: "Mi Equipo",        iconName: "skill-team",     desc: "Con quién trabajarás día a día — perfiles, dinámica y puntos de contacto." },
  { key: "workflow",   label: "Flujo de Trabajo", iconName: "skill-workflow", desc: "Cómo se mueve un proyecto: del brief al delivery, paso a paso." },
  { key: "tools",      label: "Herramientas",     iconName: "skill-tools",    desc: "El software y herramientas que usarás todos los días en OP." },
  { key: "esenciales", label: "Esenciales",       iconName: "skill-esenciales", desc: "Apps y canales clave: Okta, 911, BambooHR y todo lo que necesitas el día uno." },
  { key: "tips",       label: "Primeros 60 días", iconName: "skill-tips",     desc: "Consejos prácticos para arrancar con buen ritmo en tu nuevo rol." },
];

const EASE_PREMIUM = [0.16, 1, 0.3, 1];
const EASE_STORY   = [0, 0, 0.58, 1];

export default function Dashboard() {
  const nav       = useNavigate();
  const role      = useAppStore((s) => s.selectedRole);
  const userName  = useAppStore((s) => s.userName);
  const clearRole = useAppStore((s) => s.clearRole);
  const firstName = (userName || "").trim().split(/\s+/)[0];

  const [panel, setPanel]     = useState(null);
  const [visible, setVisible] = useState(false);
  const [feedbackOpen, setFeedbackOpen] = useState(false);

  useEffect(() => {
    if (!role) nav("/select-role", { replace: true });
    else setTimeout(() => setVisible(true), 50);
  }, [role, nav]);

  const { contents, loading, errors, load } = useSkillContent(role?.slug);

  if (!role) return null;

  const handleCardClick = async (key) => {
    if (panel?.type === "skill" && panel.key === key) {
      setPanel(null);
      return;
    }
    setPanel({ type: "skill", key });
    if (!contents[key]) {
      try { await load(key); } catch {}
    }
  };

  const handleChangeRole = () => {
    clearRole();
    nav("/select-role");
  };

  const activeCard = panel?.type === "skill" ? CARDS.find((c) => c.key === panel.key) : null;
  const completed  = CARDS.filter((c) => contents[c.key]).length;
  const progress   = Math.round((completed / CARDS.length) * 100);

  return (
    <div className="dashboard">
      {/* Fondo atmosférico */}
      <div className="dashboard__bg">
        <GradientOrb size={620} color="#2C40E4" intensity={0.25} blur={130}
                     className="-top-40 -left-40" />
        <GradientOrb size={520} color="#6689F4" intensity={0.18} blur={110}
                     className="top-1/3 -right-40" delay={2} />
        <GradientOrb size={440} color="#4361EF" intensity={0.14} blur={100}
                     className="-bottom-40 left-1/4" delay={4} />
        <GridPattern size={64} opacity={0.035} />
        <NoiseOverlay opacity={0.02} fixed={false} />
      </div>

      <div className="dashboard__container">

        {/* ── Hero ──────────────────────────────────── */}
        <motion.header
          className="dashboard__hero"
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : -16 }}
          transition={{ duration: 0.55, ease: EASE_PREMIUM }}
        >
          <div className="dashboard__hero-text">
            <BrandBadge size="md" label="OMNICOM PRODUCTION" suffix="Tu onboarding" className="dashboard__eyebrow" />
            <h1 className="dashboard__title">
              Hola, <span className="dashboard__title-em">{firstName || role.nombre}</span>
            </h1>
            <p className="dashboard__lead">
              Estás aquí como <span className="dashboard__lead-em">{role.nombre}</span>. Explora cada
              sección — el contenido está curado para tu posición y el chat con IA queda disponible 24/7 para tus dudas.
            </p>
          </div>

          <div className="dashboard__actions">
            <Button
              variant={panel?.type === "chat" ? "primary" : "secondary"}
              size="md"
              onClick={() => setPanel(panel?.type === "chat" ? null : { type: "chat" })}
            >
              <Icon name="ai-chat" size={16} /> Chat IA
            </Button>
            <Button variant="secondary" size="md" onClick={handleChangeRole}>
              <Icon name="switch" size={16} /> Cambiar rol
            </Button>
            <Button variant="secondary" size="md" onClick={() => setFeedbackOpen(true)}>
              <Icon name="spark" size={16} /> Dar reseña
            </Button>
          </div>
        </motion.header>

        {/* ── Stats row ──────────────────────────────── */}
        <motion.div
          className="dashboard__stats"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : 16 }}
          transition={{ duration: 0.5, delay: 0.15, ease: EASE_PREMIUM }}
        >
          <Stat label="Tu rol"        value={role.nombre} meta={role.area} />
          <Stat label="Progreso"      value={`${progress}%`} meta={`${completed} / ${CARDS.length} secciones`} />
          <Stat label="Asistente"     value="IA · GPT" meta="Chat libre 24/7" />
          <Stat label="Primeros días" value="60"  meta="Tu rampa de onboarding" />
        </motion.div>

        {/* ── Section header ─────────────────────────── */}
        <motion.div
          className="dashboard__section-head"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : 12 }}
          transition={{ duration: 0.45, delay: 0.25, ease: EASE_PREMIUM }}
        >
          <span className="dashboard__section-num">01</span>
          <h2 className="dashboard__section-title">Tu onboarding, sección por sección</h2>
          <span className="dashboard__section-line" />
        </motion.div>

        {/* ── Workspace: grid + panel split ──────────── */}
        <div className={`dashboard__workspace ${panel ? "dashboard__workspace--split" : ""}`}>
          <div className="dashboard__grid">
            {CARDS.map((card, i) => (
              <motion.div
                key={card.key}
                initial={{ opacity: 0, y: 28, scale: 0.96 }}
                animate={{
                  opacity: visible ? 1 : 0,
                  y: visible ? 0 : 28,
                  scale: visible ? 1 : 0.96,
                }}
                transition={{ duration: 0.5, delay: 0.3 + i * 0.07, ease: EASE_STORY }}
              >
                <DashboardCard
                  label={card.label}
                  desc={card.desc}
                  icon={<Icon name={card.iconName} size={26} />}
                  active={panel?.type === "skill" && panel.key === card.key}
                  loaded={!!contents[card.key]}
                  onClick={() => handleCardClick(card.key)}
                />
              </motion.div>
            ))}
          </div>

          {/* ── Panel split ────────────────────────────── */}
          <AnimatePresence mode="wait">
            {panel && (
              <motion.section
                key={panel.type === "chat" ? "chat" : `skill-${panel.key}`}
                className="dashboard__panel"
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 8 }}
                transition={{ duration: 0.45, ease: EASE_PREMIUM }}
              >
              {panel.type === "chat" && (
                <>
                  <div className="dashboard__panel-head">
                    <h3 className="dashboard__panel-title dashboard__panel-title--chat">
                      <span className="dashboard__panel-icon-wrap">
                        <Icon name="ai-chat" size={22} />
                      </span>
                      Chat con IA
                    </h3>
                    <button className="dashboard__panel-close" onClick={() => setPanel(null)} aria-label="Cerrar">
                      <Icon name="close" size={14} />
                    </button>
                  </div>
                  <div className="dashboard__panel-body--chat">
                    <ChatPanel role={role} />
                  </div>
                </>
              )}

              {panel.type === "skill" && activeCard && (
                <>
                  <div className="dashboard__panel-head">
                    <h3 className="dashboard__panel-title dashboard__panel-title--skill">
                      <span className="dashboard__panel-icon-wrap">
                        <Icon name={activeCard.iconName} size={22} />
                      </span>
                      {activeCard.label}
                    </h3>
                    <button className="dashboard__panel-close" onClick={() => setPanel(null)} aria-label="Cerrar">
                      <Icon name="close" size={14} />
                    </button>
                  </div>
                  <div className="dashboard__panel-body--skill">
                    <SkillView
                      content={contents[panel.key]}
                      loading={loading[panel.key]}
                      error={errors[panel.key]}
                    />
                  </div>

                  {/* Chat embebido solo en "Mi Rol" */}
                  {panel.key === "role" && (
                    <div className="dashboard__panel-chat">
                      <div className="dashboard__panel-chat-head">
                        <span className="dashboard__panel-chat-icon">
                          <Icon name="ai-chat" size={18} />
                        </span>
                        <div>
                          <h4 className="dashboard__panel-chat-title">Pregúntale a la IA sobre tu rol</h4>
                          <p className="dashboard__panel-chat-sub">
                            Conversa libremente — el historial se guarda para tu próxima sesión.
                          </p>
                        </div>
                      </div>
                      <div className="dashboard__panel-chat-body">
                        <ChatPanel role={role} />
                      </div>
                    </div>
                  )}

                  {contents[panel.key] && (
                    <div className="dashboard__panel-foot">
                      <Button variant="secondary" size="sm" onClick={() => load(panel.key, { refresh: true })}>
                        <Icon name="refresh" size={14} /> Regenerar
                      </Button>
                    </div>
                  )}
                </>
              )}
            </motion.section>
          )}
        </AnimatePresence>
        </div>
      </div>

      {/* ── Modal de reseña ────────────────────────── */}
      <AnimatePresence>
        {feedbackOpen && (
          <FeedbackModal roleSlug={role.slug} onClose={() => setFeedbackOpen(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}

function Stat({ label, value, meta }) {
  return (
    <div className="dashboard__stat">
      <span className="dashboard__stat-label">{label}</span>
      <span className="dashboard__stat-value">{value}</span>
      <span className="dashboard__stat-meta">{meta}</span>
    </div>
  );
}
