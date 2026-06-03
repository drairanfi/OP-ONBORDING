// Block: tour — slides con tabs explicando Omnicom Production LATAM.

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

import { useAppStore } from "../store/useAppStore.js";
import GradientOrb from "../components/ui/GradientOrb.jsx";
import GridPattern from "../components/ui/GridPattern.jsx";
import NoiseOverlay from "../components/ui/NoiseOverlay.jsx";
import Button from "../components/ui/Button.jsx";
import StepDots from "../components/ui/StepDots.jsx";
import Icon from "../components/ui/Icon.jsx";

const SLIDES = [
  {
    eyebrow: "Quiénes somos",
    iconName: "tour-company",
    title: "Omnicom Production",
    subtitle: "El brazo creativo y de producción de Omnicom en Latinoamérica.",
    body: "Combinamos producción audiovisual, diseño, post-producción y desarrollo digital para construir las grandes marcas del continente. Una sola cultura creativa, conectando equipos en toda LATAM.",
    highlights: ["LATAM", "200+ creativos", "End-to-end"],
  },
  {
    eyebrow: "Cómo trabajamos",
    iconName: "tour-teamwork",
    title: "Seis áreas, un solo flow",
    subtitle: "Equipos integrados que colaboran sin fronteras.",
    body: "Producción, post-producción, creatividad, gestión, internación y digital. Trabajamos en paralelo desde el brief hasta la entrega, con procesos que mantienen la visión integral del proyecto.",
    highlights: ["Producción", "Post", "Creatividad", "Digital", "Gestión", "Internación"],
  },
  {
    eyebrow: "El proceso",
    iconName: "tour-process",
    title: "De la idea al render final",
    subtitle: "Un proceso creativo end-to-end.",
    body: "Brief estratégico → desarrollo creativo → producción → post-producción → entrega. Cada paso lo lidera un experto del área, manteniendo la coherencia y la calidad en cada hito.",
    highlights: ["Brief", "Concepto", "Producción", "Delivery"],
  },
  {
    eyebrow: "Tu onboarding",
    iconName: "tour-ai",
    title: "Hecho a tu medida",
    subtitle: "Personalizado por rol, impulsado por IA.",
    body: "Esta app genera contenido específico para tu posición: tu equipo, tu flujo, tus herramientas y tips para los primeros 90 días. Además tienes un chat libre para resolver dudas en cualquier momento.",
    highlights: ["Tu rol", "Tu equipo", "Chat IA", "Primeros 90 días"],
  },
];

const EASE_PREMIUM = [0.16, 1, 0.3, 1];

export default function IntroTour() {
  const nav      = useNavigate();
  const userName = useAppStore((s) => s.userName);
  const firstName = (userName || "").trim().split(/\s+/)[0] || "creativo";

  const [idx, setIdx] = useState(0);
  const slide  = SLIDES[idx];
  const isLast = idx === SLIDES.length - 1;

  // Sin nombre, vuelve al paso 1.
  useEffect(() => {
    if (!userName) nav("/intro", { replace: true });
  }, [userName, nav]);

  const next = () => (isLast ? nav("/select-role") : setIdx(idx + 1));
  const prev = () => idx > 0 && setIdx(idx - 1);
  const skip = () => nav("/select-role");

  return (
    <div className="tour">
      {/* Fondo */}
      <div className="tour__bg">
        <GradientOrb size={560} color="#2C40E4" intensity={0.32} blur={120}
                     className="-top-32 -left-40" />
        <GradientOrb size={460} color="#6689F4" intensity={0.25} blur={110}
                     className="-bottom-32 -right-24" delay={2} />
        <GridPattern size={56} opacity={0.045} />
        <NoiseOverlay opacity={0.025} fixed={false} />
      </div>

      <div className="tour__container">

        {/* Header */}
        <header className="tour__header">
          <div className="tour__greeting-wrap">
            <span className="tour__greeting-eyebrow">Bienvenido a OP Latam</span>
            <h1 className="tour__greeting">
              Hola, <span className="tour__greeting-em">{firstName}</span>
            </h1>
            <p className="tour__greeting-sub">
              Te contamos en 2 minutos cómo trabajamos.
            </p>
          </div>

          <button onClick={skip} className="tour__skip">
            Saltar intro <Icon name="arrow-right" size={14} />
          </button>
        </header>

        {/* Tabs */}
        <nav className="tour__tabs" role="tablist">
          {SLIDES.map((s, i) => {
            const state =
              i === idx ? "active" : i < idx ? "done" : "pending";
            return (
              <button
                key={i}
                role="tab"
                aria-selected={i === idx}
                onClick={() => setIdx(i)}
                className={`tour__tab tour__tab--${state}`}
              >
                <span className="tour__tab-num">{String(i + 1).padStart(2, "0")}</span>
                <span className="tour__tab-label">{s.eyebrow}</span>
              </button>
            );
          })}
        </nav>

        {/* Slide */}
        <div className="tour__stage">
          <AnimatePresence mode="wait">
            <motion.article
              key={idx}
              className="tour__slide"
              initial={{ opacity: 0, x: 32 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -32 }}
              transition={{ duration: 0.45, ease: EASE_PREMIUM }}
            >
              <div className="tour__slide-visual">
                <div className="tour__slide-icon-wrap">
                  <span className="tour__slide-icon">
                    <Icon name={slide.iconName} size={96} strokeWidth={1.3} />
                  </span>
                </div>
                <span className="tour__slide-counter">
                  {String(idx + 1).padStart(2, "0")} / {String(SLIDES.length).padStart(2, "0")}
                </span>
              </div>

              <div className="tour__slide-content">
                <span className="tour__slide-eyebrow">{slide.eyebrow}</span>
                <h2 className="tour__slide-title">{slide.title}</h2>
                <p className="tour__slide-subtitle">{slide.subtitle}</p>
                <p className="tour__slide-body">{slide.body}</p>

                <div className="tour__highlights">
                  {slide.highlights.map((h) => (
                    <span key={h} className="tour__highlight">{h}</span>
                  ))}
                </div>
              </div>
            </motion.article>
          </AnimatePresence>
        </div>

        {/* Footer */}
        <footer className="tour__footer">
          <Button
            variant="ghost"
            size="md"
            onClick={prev}
            disabled={idx === 0}
            className="tour__nav-btn"
          >
            <Icon name="arrow-left" size={14} /> Anterior
          </Button>

          <StepDots current={idx} total={SLIDES.length} interactive onSelect={setIdx} />

          <Button
            variant="primary"
            size="md"
            onClick={next}
            className="tour__nav-btn"
          >
            {isLast ? "Elegir mi rol" : "Siguiente"} <Icon name="arrow-right" size={14} />
          </Button>
        </footer>
      </div>
    </div>
  );
}
