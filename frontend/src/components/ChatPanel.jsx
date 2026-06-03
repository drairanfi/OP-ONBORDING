// Block: chat — panel libre con burbujas, autoscroll y typing indicator.

import { useState, useEffect, useRef } from "react";
import { api } from "../api/client";
import Markdown from "./ui/Markdown.jsx";
import Icon from "./ui/Icon.jsx";

export default function ChatPanel({ role }) {
  const isGuest = !role;
  const slug = role?.slug || "guest";

  const greeting = isGuest
    ? `¡Hola! Soy el asistente de onboarding de **OP Latam**. ¿No encuentras tu rol en la lista? Cuéntame qué haces, tu cargo o tu equipo y te ayudo a ubicarlo. También respondo dudas generales sobre las áreas de la compañía.`
    : `¡Hola! Soy tu asistente de onboarding en OP Latam. Estoy aquí para ayudarte con todo lo relacionado con tu rol como **${role.nombre}**. ¿Qué quieres saber?`;

  const [messages, setMessages] = useState([{ role: "assistant", content: greeting }]);
  const [input, setInput]     = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    if (isGuest) return; // sin rol no hay historial persistido
    api.getChatHistory(slug)
      .then((d) => {
        if (d.messages?.length) {
          setMessages(d.messages.map((m) => ({ role: m.role, content: m.content })));
        }
      })
      .catch(() => {});
  }, [slug, isGuest]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, sending]);

  const send = async () => {
    const text = input.trim();
    if (!text || sending) return;
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: text }]);
    setSending(true);
    try {
      const { content } = await api.sendChat(slug, text);
      setMessages((prev) => [...prev, { role: "assistant", content }]);
    } catch (e) {
      setMessages((prev) => [...prev, { role: "assistant", content: `⚠ ${e.message}` }]);
    } finally {
      setSending(false);
    }
  };

  const sendDisabled = !input.trim() || sending;

  return (
    <div className="chat">
      <div className="chat__messages">
        {messages.map((m, i) => <Bubble key={i} message={m} />)}
        {sending && <TypingIndicator />}
        <div ref={bottomRef} />
      </div>

      <div className="chat__input-row">
        <input
          className="chat__input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && send()}
          placeholder={isGuest ? "Describe tu cargo o área y te ayudo a ubicar tu rol…" : "Pregunta algo sobre tu rol o OP Latam…"}
        />
        <button
          onClick={send}
          disabled={sendDisabled}
          className={`chat__send chat__send--${sendDisabled ? "disabled" : "enabled"}`}
          aria-label="Enviar"
        >
          <Icon name="send" size={18} />
        </button>
      </div>
    </div>
  );
}

function Bubble({ message }) {
  const isUser = message.role === "user";
  return (
    <div className={`chat-bubble chat-bubble--${isUser ? "user" : "assistant"}`}>
      {!isUser && (
        <div className="chat-bubble__avatar">
          <Icon name="ai-avatar" size={16} />
        </div>
      )}
      <div className={`chat-bubble__body chat-bubble__body--${isUser ? "user" : "assistant"}`}>
        <Markdown tone={isUser ? "onPrimary" : "default"}>{message.content}</Markdown>
      </div>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="typing">
      <div className="typing__avatar">
        <Icon name="ai-avatar" size={16} />
      </div>
      <div className="typing__bubble">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="typing__dot"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>
    </div>
  );
}
