import { create } from "zustand";
import axios from "axios";
import { useAuthStore } from "./authStore";

export const useWalletStore = create((set, get) => ({
  /* ---------------- STATE ---------------- */

  balances: {
    spot: {},
    futures: {},
  },

  positions: [],

  loading: false,

  /* ---------------- FETCH WALLET ---------------- */

  fetchWallet: async () => {
    const { accessToken, refresh } = useAuthStore.getState();
    if (!accessToken) return;

    try {
      set({ loading: true });

      const res = await axios.get("/wallet", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      set({
        balances: {
          spot: res.data.spot || {},
          futures: res.data.futures || {},
        },
      });

    } catch (err) {
      if (err.response?.status === 401) {
        const refreshed = await refresh();
        if (refreshed) return get().fetchWallet();
      }

      console.error("Wallet fetch failed:", err);
    } finally {
      set({ loading: false });
    }
  },

  /* ---------------- FETCH POSITIONS ---------------- */

  fetchPositions: async () => {
    const { accessToken } = useAuthStore.getState();
    if (!accessToken) return;

    try {
      const res = await axios.get("/trade/futures", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      set({ positions: res.data.positions || [] });

    } catch (err) {
      console.error("Fetch positions failed:", err);
    }
  },

}));