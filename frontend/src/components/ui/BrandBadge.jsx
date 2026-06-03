// Block: brand-badge — chip corporativo con logo + nombre.

import defaultLogo from "../../assets/op.png";
import Icon from "./Icon.jsx";

export default function BrandBadge({
  size = "sm",
  label = "OP LATAM",
  suffix,
  logo = defaultLogo,
  className = "",
}) {
  return (
    <div className={`brand-badge brand-badge--${size} ${className}`}>
      <div className="brand-badge__icon">
        {logo ? (
          <img src={logo} alt="" className="brand-badge__logo" />
        ) : (
          <Icon name="brand" size={18} />
        )}
      </div>
      <span className="brand-badge__label">
        {label}
        {suffix && <span className="brand-badge__suffix">— {suffix}</span>}
      </span>
    </div>
  );
}
