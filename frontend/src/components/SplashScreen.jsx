// Block: splash — bienvenida Omnicom Production LATAM.

import { motion } from "framer-motion";
import GradientOrb from "./ui/GradientOrb.jsx";
import GridPattern from "./ui/GridPattern.jsx";
import NoiseOverlay from "./ui/NoiseOverlay.jsx";
import AnimatedRings from "./ui/AnimatedRings.jsx";
import BrandBadge from "./ui/BrandBadge.jsx";
import ProgressDots from "./ui/ProgressDots.jsx";
import Icon from "./ui/Icon.jsx";

const EASE_PREMIUM  = [0.16, 1, 0.3, 1];
const EASE_STANDARD = [0.2, 0, 0, 1];

export default function SplashScreen() {
  return (
    <div className="splash">
      {/* Capa 1 — orbes glow */}
      <GradientOrb size={620} color="#2C40E4" intensity={0.55} blur={120}
                   className="-top-40 -left-32" />
      <GradientOrb size={520} color="#6689F4" intensity={0.40} blur={110}
                   className="-bottom-40 -right-24" delay={1.5} />
      <GradientOrb size={380} color="#4361EF" intensity={0.30} blur={90}
                   className="top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" delay={3} />

      {/* Capa 2 — grilla */}
      <GridPattern size={64} opacity={0.05} />

      {/* Capa 3 — ruido */}
      <NoiseOverlay opacity={0.04} />

      {/* Capa 4 — contenido */}
      <motion.div
        className="splash__stage"
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: EASE_PREMIUM }}
      >
        <motion.div
          className="splash__brand"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15, ease: EASE_STANDARD }}
        >
          <BrandBadge size="md" label="OMNICOM PRODUCTION" suffix="LATAM" />
        </motion.div>

        <motion.div
          className="splash__logo-wrap"
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.25, ease: EASE_PREMIUM }}
        >
          <AnimatedRings>
            <div className="splash__logo">
              <Icon name="brand" size={56} strokeWidth={1.3} />
            </div>
          </AnimatedRings>
        </motion.div>

        <motion.p
          className="splash__eyebrow"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.55, ease: EASE_STANDARD }}
        >
          Bienvenido al equipo
        </motion.p>

        <motion.h1
          className="splash__heading"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.7, ease: EASE_PREMIUM }}
        >
          OP Latam
        </motion.h1>

        <motion.p
          className="splash__subhead"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.95, ease: EASE_STANDARD }}
        >
          Tu plataforma de onboarding inteligente para
          <span className="splash__subhead-em"> Omnicom Production</span>.
        </motion.p>

        <motion.p
          className="splash__tagline"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1.15 }}
        >
          Personalizada por rol · impulsada por IA · diseñada para creativos.
        </motion.p>

        <motion.div
          className="splash__loader"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.4 }}
        >
          <span className="splash__loader-divider" />
          <ProgressDots color="#6689F4" />
          <span className="splash__loader-label">Preparando tu experiencia</span>
        </motion.div>
      </motion.div>

      <motion.footer
        className="splash__footer"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 1.6 }}
      >
        <span>v1.0 · onboarding</span>
        <span>© Omnicom Production LATAM</span>
      </motion.footer>
    </div>
  );
}
