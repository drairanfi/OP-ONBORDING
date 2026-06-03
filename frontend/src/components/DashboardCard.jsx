// Block: dash-card — tarjeta de skill del dashboard.

import Icon from "./ui/Icon.jsx";

export default function DashboardCard({ icon, label, desc, onClick, active, loaded }) {
  // Mouse-track para el spotlight radial
  const handleMouseMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    const mx = ((e.clientX - r.left) / r.width) * 100;
    const my = ((e.clientY - r.top)  / r.height) * 100;
    e.currentTarget.style.setProperty("--mx", `${mx}%`);
    e.currentTarget.style.setProperty("--my", `${my}%`);
  };

  return (
    <button
      onClick={onClick}
      onMouseMove={handleMouseMove}
      className={`dash-card ${active ? "dash-card--active" : ""}`}
    >
      <span className="dash-card__accent" />

      <div className="dash-card__head">
        <div className="dash-card__icon-wrap">{icon}</div>
        {loaded && (
          <span className="dash-card__badge">
            <span className="dash-card__badge-dot" />
            Listo
          </span>
        )}
      </div>

      <h3 className="dash-card__title">{label}</h3>
      <p className="dash-card__desc">{desc}</p>

      <div className="dash-card__footer">
        <span className="dash-card__cta">
          {active ? "Cerrar" : loaded ? "Ver de nuevo" : "Generar"}
          <span className="dash-card__cta-arrow">
            <Icon name="arrow-right" size={14} />
          </span>
        </span>
        <span className="dash-card__hint">{loaded ? "Cacheado" : "IA · 5s"}</span>
      </div>
    </button>
  );
}
