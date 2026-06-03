// Block: noise — overlay de ruido fractal.

export default function NoiseOverlay({ opacity = 0.025, fixed = true, className = "" }) {
  const placement = fixed ? "noise--fixed" : "noise--absolute";
  return (
    <div
      aria-hidden
      className={`noise ${placement} ${className}`}
      style={{ opacity }}
    />
  );
}
