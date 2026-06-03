// Block: feedback — modal de reseña final. Calificación por estrellas (1-5) +
// comentario con sugerencias de mejora. Se envía a POST /api/ai/feedback.

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { api } from "../api/client.js";
import Button from "./ui/Button.jsx";
import Icon from "./ui/Icon.jsx";

const STARS = [1, 2, 3, 4, 5];
const LABELS = {
  0: "Tocá una estrella para calificar",
  1: "Muy por debajo de lo esperado",
  2: "Le falta bastante",
  3: "Cumple, pero mejorable",
  4: "Muy buena experiencia",
  5: "¡Excelente! La recomendaría",
};
const EASE_PREMIUM = [0.16, 1, 0.3, 1];

function Star({ filled }) {
  return (
    <svg viewBox="0 0 24 24" width="100%" height="100%" aria-hidden="true" focusable="false">
      <path
        d="M12 3.2l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.7 6.8 19.3l1-5.8L3.5 9.4l5.9-.9L12 3.2Z"
        fill={filled ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function FeedbackModal({ roleSlug, onClose }) {
  const [rating, setRating]   = useState(0);
  const [hover, setHover]     = useState(0);
  const [comment, setComment] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent]       = useState(false);
  const [error, setError]     = useState(null);

  const active = hover || rating;

  const submit = async () => {
    if (rating < 1 || sending) return;
    setSending(true);
    setError(null);
    try {
      await api.sendFeedback(roleSlug || "guest", rating, comment.trim());
      setSent(true);
    } catch (e) {
      setError(e.message || "No se pudo enviar la reseña.");
    } finally {
      setSending(false);
    }
  };

  return (
    <motion.div
      className="feedback__overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Reseña de la app"
    >
      <motion.div
        className="feedback__card"
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 16, scale: 0.98 }}
        transition={{ duration: 0.4, ease: EASE_PREMIUM }}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="feedback__close" onClick={onClose} aria-label="Cerrar">
          <Icon name="close" size={14} />
        </button>

        <AnimatePresence mode="wait">
          {sent ? (
            <motion.div
              key="thanks"
              className="feedback__thanks"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: EASE_PREMIUM }}
            >
              <span className="feedback__thanks-icon">
                <Icon name="check" size={30} />
              </span>
              <h3 className="feedback__title">¡Gracias por tu reseña!</h3>
              <p className="feedback__lead">
                Tu opinión nos ayuda a mejorar el onboarding para las próximas personas que lleguen a OP.
              </p>
              <Button variant="primary" size="md" onClick={onClose}>
                Listo
              </Button>
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className="feedback__head">
                <span className="feedback__eyebrow">
                  <Icon name="spark" size={14} /> Antes de irte
                </span>
                <h3 className="feedback__title">¿Cómo estuvo tu onboarding?</h3>
                <p className="feedback__lead">
                  Calificá la app y contanos qué podríamos mejorar. Toma menos de un minuto.
                </p>
              </div>

              <div className="feedback__stars" role="radiogroup" aria-label="Calificación">
                {STARS.map((n) => (
                  <button
                    key={n}
                    type="button"
                    className={`feedback__star ${n <= active ? "is-active" : ""}`}
                    onMouseEnter={() => setHover(n)}
                    onMouseLeave={() => setHover(0)}
                    onClick={() => setRating(n)}
                    role="radio"
                    aria-checked={rating === n}
                    aria-label={`${n} de 5`}
                  >
                    <Star filled={n <= active} />
                  </button>
                ))}
              </div>
              <p className="feedback__hint">{LABELS[active] ?? LABELS[0]}</p>

              <textarea
                className="feedback__textarea"
                placeholder="¿Qué te gustó? ¿Qué deberíamos mejorar? (opcional)"
                value={comment}
                maxLength={2000}
                onChange={(e) => setComment(e.target.value)}
                rows={4}
              />

              {error && <p className="feedback__error">{error}</p>}

              <div className="feedback__actions">
                <Button variant="ghost" size="md" onClick={onClose}>
                  Ahora no
                </Button>
                <Button
                  variant="primary"
                  size="md"
                  disabled={rating < 1 || sending}
                  onClick={submit}
                >
                  <Icon name="send" size={16} /> {sending ? "Enviando…" : "Enviar reseña"}
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
