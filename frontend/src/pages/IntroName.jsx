// Block: intro — pantalla que pide el nombre del usuario.

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

import { useAppStore } from "../store/useAppStore.js";
import GradientOrb from "../components/ui/GradientOrb.jsx";
import GridPattern from "../components/ui/GridPattern.jsx";
import NoiseOverlay from "../components/ui/NoiseOverlay.jsx";
import BrandBadge from "../components/ui/BrandBadge.jsx";
import TextField from "../components/ui/TextField.jsx";
import Button from "../components/ui/Button.jsx";
import StepDots from "../components/ui/StepDots.jsx";
import Icon from "../components/ui/Icon.jsx";

const EASE_PREMIUM  = [0.16, 1, 0.3, 1];
const EASE_STANDARD = [0.2, 0, 0, 1];

export default function IntroName() {
  const nav = useNavigate();
  const stored      = useAppStore((s) => s.userName);
  const setUserName = useAppStore((s) => s.setUserName);

  const [name, setName] = useState(stored || "");
  const firstName       = name.trim().split(/\s+/)[0];
  const canContinue     = name.trim().length >= 2;

  const submit = (e) => {
    e?.preventDefault();
    if (!canContinue) return;
    setUserName(name.trim());
    nav("/tour");
  };

  return (
    <div className="intro">
      {/* Fondo atmosférico */}
      <div className="intro__bg">
        <GradientOrb size={620} color="#2C40E4" intensity={0.40} blur={130}
                     className="-top-40 -left-32" />
        <GradientOrb size={520} color="#6689F4" intensity={0.32} blur={110}
                     className="-bottom-32 -right-24" delay={1.5} />
        <GradientOrb size={380} color="#4361EF" intensity={0.22} blur={90}
                     className="top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" delay={3} />
        <GridPattern size={64} opacity={0.05} />
        <NoiseOverlay opacity={0.03} fixed={false} />
      </div>

      <form className="intro__container" onSubmit={submit}>
        <motion.div
          className="intro__steps"
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: EASE_STANDARD }}
        >
          <StepDots current={0} total={3} />
          <span className="intro__steps-label">Paso 1 de 3 · Identidad</span>
        </motion.div>

        <motion.div
          className="intro__brand"
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1, ease: EASE_STANDARD }}
        >
          <BrandBadge size="md" label="OMNICOM PRODUCTION" suffix="LATAM" />
        </motion.div>

        <motion.h1
          className="intro__title"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.2, ease: EASE_PREMIUM }}
        >
          Antes que nada,
          <br />
          <span className="intro__title-em">¿cómo te llamas?</span>
        </motion.h1>

        <motion.p
          className="intro__lead"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.35, ease: EASE_STANDARD }}
        >
          Usaremos tu nombre para personalizar la experiencia. Después te
          contamos cómo funciona OP Latam y elegiremos tu rol.
        </motion.p>

        <motion.div
          className="intro__form"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.5, ease: EASE_PREMIUM }}
        >
          <label className="intro__field-label" htmlFor="userName">
            Tu nombre
          </label>
          <TextField
            id="userName"
            size="xl"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ej. María Fernández"
            autoFocus
            autoComplete="given-name"
          />

          <AnimatePresence>
            {firstName && firstName.length >= 2 && (
              <motion.div
                className="intro__preview"
                key="preview"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.35, ease: EASE_PREMIUM }}
              >
                <span className="intro__preview-emoji">✨</span>
                Hola, <span className="intro__preview-name">{firstName}</span> — un gusto tenerte aquí.
              </motion.div>
            )}
          </AnimatePresence>

          <div className="intro__actions">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              disabled={!canContinue}
              className="intro__cta"
            >
              Continuar <Icon name="arrow-right" size={14} />
            </Button>
            <span className="intro__hint">Presiona ↵ para continuar</span>
          </div>
        </motion.div>
      </form>
    </div>
  );
}
