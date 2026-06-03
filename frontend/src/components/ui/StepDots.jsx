// Block: step-dots — indicador de paso con dots opcionalmente interactivos.

export default function StepDots({
  current = 0,
  total = 3,
  interactive = false,
  onSelect,
  className = "",
}) {
  return (
    <div className={`step-dots ${className}`} role="tablist" aria-label="Pasos">
      {Array.from({ length: total }).map((_, i) => {
        const state =
          i === current ? "active" : i < current ? "done" : "pending";
        const Tag = interactive ? "button" : "span";
        return (
          <Tag
            key={i}
            role={interactive ? "tab" : undefined}
            aria-current={i === current}
            onClick={interactive ? () => onSelect?.(i) : undefined}
            className={`step-dots__dot step-dots__dot--${state} ${
              interactive ? "step-dots__dot--interactive" : ""
            }`}
          />
        );
      })}
    </div>
  );
}
