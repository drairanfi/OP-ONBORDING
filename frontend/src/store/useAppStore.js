import { create } from "zustand";

// Mini store global. Persistimos rol y nombre en sessionStorage.
const ROLE_KEY = "op_onboarding_role";
const NAME_KEY = "op_onboarding_name";

const loadRole = () => {
  try {
    const raw = sessionStorage.getItem(ROLE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
};

const loadName = () => {
  try { return sessionStorage.getItem(NAME_KEY) || ""; }
  catch { return ""; }
};

export const useAppStore = create((set) => ({
  userName: loadName(),
  selectedRole: loadRole(),

  setUserName: (name) => {
    try { sessionStorage.setItem(NAME_KEY, name); } catch {}
    set({ userName: name });
  },
  clearUserName: () => {
    try { sessionStorage.removeItem(NAME_KEY); } catch {}
    set({ userName: "" });
  },

  setRole: (role) => {
    try { sessionStorage.setItem(ROLE_KEY, JSON.stringify(role)); } catch {}
    set({ selectedRole: role });
  },
  clearRole: () => {
    try { sessionStorage.removeItem(ROLE_KEY); } catch {}
    set({ selectedRole: null });
  },
}));
