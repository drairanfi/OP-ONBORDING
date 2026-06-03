// Opcional: ruta dedicada de chat (no usada por default en el flujo).
// El chat principal vive embebido en /dashboard.

import { useNavigate } from "react-router-dom";
import { useAppStore } from "../store/useAppStore.js";
import ChatPanel from "../components/ChatPanel.jsx";
import Button from "../components/ui/Button.jsx";
import Icon from "../components/ui/Icon.jsx";

export default function Chat() {
  const nav = useNavigate();
  const role = useAppStore(s => s.selectedRole);

  if (!role) {
    nav("/select-role", { replace: true });
    return null;
  }

  return (
    <div className="h-full max-w-[900px] mx-auto px-8 py-10 flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-[24px] leading-[26px] font-semibold text-txt-primary">
          Chat — {role.nombre}
        </h1>
        <Button variant="secondary" size="sm" onClick={() => nav("/dashboard")}>
          <Icon name="arrow-left" size={14} /> Volver
        </Button>
      </div>
      <div className="flex-1 bg-level-2 border border-level-6 rounded-op-xl p-6 overflow-hidden">
        <ChatPanel role={role} />
      </div>
    </div>
  );
}
