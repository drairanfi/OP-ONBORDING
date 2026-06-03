// Block: btn — botón con variantes primary | secondary | ghost y tamaños sm | md | lg.

export default function Button({
  children,
  variant = "primary",
  size = "md",
  disabled = false,
  className = "",
  ...rest
}) {
  const classes = [
    "btn",
    `btn--${variant}`,
    `btn--${size}`,
    disabled ? "is-disabled" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button disabled={disabled} className={classes} {...rest}>
      {children}
    </button>
  );
}
