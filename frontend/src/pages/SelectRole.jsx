import { useNavigate } from "react-router-dom";
import RolePicker from "../components/RolePicker.jsx";
import { useAppStore } from "../store/useAppStore.js";
import { api } from "../api/client.js";

export default function SelectRole() {
  const nav = useNavigate();
  const setRole = useAppStore((s) => s.setRole);

  const handleSelect = async (role) => {
    setRole(role);
    api.registerSession(role.slug).catch(() => {});
    nav("/dashboard");
  };

  return (
    <div className="role-picker-page">
      <RolePicker onSelect={handleSelect} />
    </div>
  );
}
