// Block: titlebar — barra superior con logo + breadcrumb del flow + usuario + controles.

import { useLocation, useNavigate } from "react-router-dom";
import BrandBadge from "./BrandBadge.jsx";
import Icon from "./Icon.jsx";
import { useAppStore } from "../../store/useAppStore.js";

const STEPS = [
  { path: "/intro",       label: "Identidad",  num: "01" },
  { path: "/tour",        label: "La empresa", num: "02" },
  { path: "/select-role", label: "Tu rol",     num: "03" },
  { path: "/dashboard",   label: "Onboarding", num: "04" },
];

export default function TitleBar() {
  const isElectron = typeof window !== "undefined" && !!window.opAPI;
  const { pathname } = useLocation();
  const nav         = useNavigate();
  const userName    = useAppStore((s) => s.userName);
  const role        = useAppStore((s) => s.selectedRole);
  const firstName   = (userName || "").trim().split(/\s+/)[0];
  const initial     = firstName ? firstName[0].toUpperCase() : "";

  const currentIdx = STEPS.findIndex((s) => s.path === pathname);
  const showSteps  = currentIdx >= 0;

  // Permite volver a pasos previos si ya hay contexto suficiente
  const canNavTo = (idx) => {
    if (idx === 0) return true;                       // /intro siempre disponible
    if (idx === 1) return !!userName;                 // /tour requiere nombre
    if (idx === 2) return !!userName;                 // /select-role requiere nombre
    if (idx === 3) return !!userName && !!role;       // /dashboard requiere rol
    return false;
  };

  const handleStepClick = (step, idx) => {
    if (idx < currentIdx && canNavTo(idx)) nav(step.path);
  };

  return (
    <header className="titlebar">
      <div className="titlebar__brand">
        <BrandBadge size="md" label="OMNICOM PRODUCTION" suffix="LATAM" />
      </div>

      {showSteps && (
        <nav className="titlebar__steps" aria-label="Progreso del onboarding">
          {STEPS.map((step, i) => {
            const state =
              i === currentIdx ? "active" : i < currentIdx ? "done" : "pending";
            const clickable = i < currentIdx && canNavTo(i);
            return (
              <div key={step.path} className="titlebar__step-wrap">
                <button
                  type="button"
                  disabled={!clickable}
                  onClick={() => handleStepClick(step, i)}
                  className={`titlebar__step titlebar__step--${state}`}
                  aria-current={i === currentIdx}
                >
                  <span className="titlebar__step-num">{step.num}</span>
                  <span className="titlebar__step-label">{step.label}</span>
                </button>
                {i < STEPS.length - 1 && <span className="titlebar__step-sep" />}
              </div>
            );
          })}
        </nav>
      )}

      <div className="titlebar__right">
        {firstName && (
          <div className="titlebar__user" title={role?.nombre || firstName}>
            <div className="titlebar__user-avatar">{initial}</div>
            <div className="titlebar__user-text">
              <span className="titlebar__user-name">{firstName}</span>
              {role && <span className="titlebar__user-role">{role.nombre}</span>}
            </div>
          </div>
        )}

        {isElectron && (
          <div className="titlebar__controls">
            <WindowBtn iconName="window-min" label="Minimizar" onClick={() => window.opAPI.minimize()} />
            <WindowBtn iconName="window-max" label="Maximizar" onClick={() => window.opAPI.maximize()} />
            <WindowBtn iconName="window-close" label="Cerrar" onClick={() => window.opAPI.close()} danger />
          </div>
        )}
      </div>
    </header>
  );
}

function WindowBtn({ iconName, label, onClick, danger }) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className={`titlebar__btn ${danger ? "titlebar__btn--danger" : ""}`}
    >
      <Icon name={iconName} size={14} />
    </button>
  );
}
