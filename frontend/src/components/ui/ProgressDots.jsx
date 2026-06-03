// Block: dots — tres puntos pulsantes.

import { motion } from "framer-motion";

export default function ProgressDots({ color = "#4361EF", size = 6, className = "" }) {
  return (
    <div className={`dots ${className}`}>
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          aria-hidden
          className="dots__dot"
          style={{ width: size, height: size, backgroundColor: color }}
          animate={{ opacity: [0.25, 1, 0.25], y: [0, -2, 0] }}
          transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.18, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}
