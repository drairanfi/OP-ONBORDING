// Block: skill-view — renderiza el markdown generado por IA con tres estados.

import Markdown from "./ui/Markdown.jsx";

export default function SkillView({ content, loading, error }) {
  if (loading) {
    return (
      <div className="skill-view__loading">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="skill-view__skeleton"
            style={{
              height: i === 1 ? 20 : 14,
              width: i === 1 ? "60%" : `${40 + Math.random() * 40}%`,
            }}
          />
        ))}
      </div>
    );
  }

  if (error) {
    return <div className="skill-view__error">⚠ {error}</div>;
  }

  if (!content) {
    return <div className="skill-view__empty">Click en la card para generar el contenido.</div>;
  }

  return <Markdown>{content}</Markdown>;
}
