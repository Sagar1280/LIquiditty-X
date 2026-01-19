import { create } from "zustand";
import axios from "axios";
import { useAuthStore } from "./authStore";

export const useWalletStore = create((set, get) => ({
  balances: {},
  loading: false,

  updateBalance: (asset, amount) =>
    set((state) => ({
      balances: {
        ...state.balances,
        [asset]: (state.balances[asset] || 0) + amount,
      },
    })),

  setBalances: (balances) => set({ balances}),

  clearWallet: () => set({ balances: {} }),

  fetchWallet: async () => {
    const { accessToken, refresh } = useAuthStore.getState();

    if (!accessToken) {
      console.warn("No access token — skipping wallet fetch");
      return;
    }

    try {
      set({ loading: true });

      const res = await axios.get("/wallet", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      console.log("📦 Wallet(fetched) API response:", res.data);

      // backend already returns balances object
      set({ balances: res.data.balances });

    } catch (err) {
      // 🔄 auto refresh on token expiry
      if (err.response?.status === 401) {
        const refreshed = await refresh();
        if (refreshed) {
          return get().fetchWallet();
        }
      }

      console.error("Wallet fetch failed", err);
      set({ balances: {} });
    } finally {
      set({ loading: false });
    }
  },
}));
