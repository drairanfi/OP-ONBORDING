// Block: text-field — input de texto reutilizable.

import { forwardRef } from "react";

const TextField = forwardRef(function TextField(
  { size = "md", className = "", ...rest },
  ref
) {
  return (
    <input
      ref={ref}
      className={`text-field text-field--${size} ${className}`}
      {...rest}
    />
  );
});

export default TextField;
