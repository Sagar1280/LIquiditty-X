import { create } from "zustand";

export const useAuthStore = create((set) => ({
  authModal: null, // "login" or "signup"

  openAuth: (mode) => set({ authModal: mode }),

  closeAuth: () => set({ authModal: null }),
}));
