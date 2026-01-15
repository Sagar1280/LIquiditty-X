import { create } from "zustand";
import axios from "axios";

axios.defaults.withCredentials = true;  // send refresh cookies automatically
axios.defaults.baseURL = "http://localhost:5000"; // cleaner API calls

export const useAuthStore = create((set, get) => ({

  authModal: null,           // "login" | "signup" | null
  accessToken: null,         // short-lived & volatile
  email: null,               // minor identity UI
  loading: false,            // helpful UI flag

  // ---------------- UI (Modal) ----------------
  openAuth: (mode) => set({ authModal: mode }),
  closeAuth: () => set({ authModal: null }),

  // ---------------- LOGIN ----------------
  login: async (email, password) => {
    set({ loading: true });

    try {
      const res = await axios.post("/auth/login", { email, password });

      set({
        accessToken: res.data.accessToken,
        email: res.data.email,
        authModal: null,
      });
      

      console.log("Logged in");
      alert("you have been  sucessfully logged in");

    } catch (err) {
      console.log("Login failed:", err.response?.data || err);
    } finally {
      set({ loading: false });
    }
  },

  // ---------------- SIGNUP ----------------
  signup: async (email, password) => {
    set({ loading: true });

    try {
      await axios.post("/auth/signup", { email, password });

      // auto login after signup (optional)
      await get().login(email, password);

    } catch (err) {
      console.log("Signup failed:", err.response?.data || err);
    } finally {
      set({ loading: false });
    }
  },

  // ---------------- REFRESH TOKEN (Auto) ----------------
  refresh: async () => {
    try {
      const res = await axios.post("/auth/refresh");
      console.log("New Access Token:", res.data.accessToken);

      // refresh ONLY returns new access token, not new refresh
      set({
        accessToken: res.data.accessToken,
        email: res.data.email
      });

      
      return true;

    } catch (err) {
      console.log("Refresh failed - must re-login");
      set({ accessToken: null, email: null });
      return false;
    }
  },

  // ---------------- LOGOUT ----------------
  logout: async () => {
    await axios.post("/auth/logout");
    set({
      accessToken: null,
      email: null
    });
    console.log("Logged out");
  },

  restoreSession: async () => {
  try {
    const res = await axios.post("/auth/refresh");
    
    console.log(`restored session ,, accesstoken :${res.data.accessToken}`)
    set({
      accessToken: res.data.accessToken,
      email: res.data.user.email
    });
  } catch (err) {
    set({ accessToken: null, email: null });
  }
}
}));
