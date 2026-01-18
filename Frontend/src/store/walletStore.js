import { create } from "zustand";

export const useWalletStore = create((set) => ({
  balances: {},     
  loading: false,

  setBalances: (balances) => set({ balances }),

  clearWallet: () => set({ balances: {} }),

  fetchWallet: async (token) => {
    try {
      set({ loading: true });

      const res = await fetch("http://localhost:5000/wallet", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to fetch wallet");

      const data = await res.json();
      console.log("📦 wallet API response:", data);
      set({ balances: data.balances });

    } catch (err) {
      console.error("Wallet fetch error", err);
      set({ balances: {} });
    } finally {
      set({ loading: false });
    }
  },
}));
