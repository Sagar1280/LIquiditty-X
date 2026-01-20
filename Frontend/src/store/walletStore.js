import { create } from "zustand";
import axios from "axios";
import { useAuthStore } from "./authStore";

export const useWalletStore = create((set, get) => ({
  
  balances: {
    spot: {},
    futures: {},
  },

  loading: false,

  /* ---------------- SETTERS ---------------- */

  setBalances: (spotBalances, futuresBalances) =>
    set({
      balances: {
        spot: spotBalances,
        futures: futuresBalances,
      },
    }),

  clearWallet: () =>
    set({
      balances: {
        spot: {},
        futures: {},
      },
    }),

  /* ---------------- FETCH WALLET ---------------- */

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

      set({
        balances: {
          spot: res.data.spot || {},
          futures: res.data.futures || {},
        },
      });

      console.log("📦 Wallet fetched:", res.data);

    } catch (err) {
      if (err.response?.status === 401) {
        const refreshed = await refresh();
        if (refreshed) {
          return get().fetchWallet(); // 🔁 retry ONCE
        }
      }

      console.error("Wallet fetch failed:", err);
      get().clearWallet();

    } finally {
      set({ loading: false });
    }
  },

  /* ---------------- WALLET TRANSFER (OPTIONAL, FUTURE) ---------------- */

  transferFunds: async ({ from, to, asset, amount }) => {
    const { accessToken, refresh } = useAuthStore.getState();

    try {
      await axios.post(
        "/wallet/transfer",
        { from, to, asset, amount },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      await get().fetchWallet();

    } catch (err) {
      if (err.response?.status === 401) {
        const refreshed = await refresh();
        if (refreshed) {
          return get().transferFunds({ from, to, asset, amount });
        }
      }

      console.error("Wallet transfer failed", err);
    }
  },
}));
