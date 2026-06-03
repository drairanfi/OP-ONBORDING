// Block: grid-pattern — cuadrícula sutil con máscara radial opcional.

export default function GridPattern({
  size = 60,
  opacity = 0.04,
  color = "rgba(255,255,255,0.5)",
  mask = true,
  className = "",
}) {
  const modifier = mask ? "grid-pattern--masked" : "";
  return (
    <div
      aria-hidden
      className={`grid-pattern ${modifier} ${className}`}
      style={{
        opacity,
        backgroundImage: `linear-gradient(${color} 1px, transparent 1px), linear-gradient(90deg, ${color} 1px, transparent 1px)`,
        backgroundSize: `${size}px ${size}px`,
      }}
    />
  );
}
