// Block: rings — anillos concéntricos pulsantes alrededor del núcleo.

import { motion } from "framer-motion";

export default function AnimatedRings({ children, color = "#4361EF" }) {
  return (
    <div className="rings">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          aria-hidden
          className="rings__ring"
          style={{
            borderColor: `rgba(67, 97, 239, ${0.35 - i * 0.1})`,
            width: 96 + i * 36,
            height: 96 + i * 36,
          }}
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: [0, 0.6, 0], scale: [0.8, 1.15, 1.4] }}
          transition={{ duration: 3.6, repeat: Infinity, delay: i * 0.9, ease: "easeOut" }}
        />
      ))}
      <div className="rings__core" style={{ filter: `drop-shadow(0 0 24px ${color}66)` }}>
        {children}
      </div>
    </div>
  );
}
