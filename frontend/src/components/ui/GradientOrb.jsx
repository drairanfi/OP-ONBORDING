// Block: orb — mancha luminosa difuminada para fondos atmosféricos.

import { motion } from "framer-motion";

export default function GradientOrb({
  size = 480,
  color = "#4361EF",
  intensity = 0.45,
  blur = 80,
  className = "",
  animate = true,
  delay = 0,
}) {
  const style = {
    width: size,
    height: size,
    filter: `blur(${blur}px)`,
    background: `radial-gradient(circle at 50% 50%, ${rgba(color, intensity)} 0%, ${rgba(color, intensity * 0.5)} 35%, transparent 70%)`,
  };

  if (!animate) {
    return <div aria-hidden className={`orb ${className}`} style={style} />;
  }

  return (
    <motion.div
      aria-hidden
      className={`orb ${className}`}
      style={style}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: [0.6, 1, 0.6], scale: [0.95, 1.05, 0.95] }}
      transition={{ duration: 8, delay, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}

function rgba(hex, alpha) {
  if (hex.startsWith("rgb")) return hex.replace(")", `, ${alpha})`).replace("rgb(", "rgba(");
  const h = hex.replace("#", "");
  const r = parseInt(h.substring(0, 2), 16);
  const g = parseInt(h.substring(2, 4), 16);
  const b = parseInt(h.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
