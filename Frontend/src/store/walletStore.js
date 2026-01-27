import { create } from "zustand";
import axios from "axios";
import { useAuthStore } from "./authStore";


export const useWalletStore = create((set, get) => ({
  /* ---------------- WALLET BALANCES ---------------- */

  balances: {
    spot: {},
    futures: {},
  },

  loading: false,

  /* ---------------- FUTURES ENGINE STATE ---------------- */

  positions: [],

  usedMargin: 0,

  /* ---------------- DERIVED HELPERS ---------------- */


  getFuturesBalance: () => {
    const state = get();
    return state.balances.futures["USDT"] ?? 0;
  },


  getAvailableFuturesBalance: () => {
    const state = get();
    const total = state.getFuturesBalance();
    return total - state.usedMargin;
  },


  /* ---------------- POSITION MANAGEMENT ---------------- */


  openPosition: ({ pair, side, leverage, entryPrice, usdtAmount }) =>
    set((state) => {
      const marginRequired = usdtAmount / leverage;

      const totalBalance = state.getFuturesBalance();
      const available = totalBalance - state.usedMargin;

      if (marginRequired > available) {
        console.log("Insufficient margin");
        return state;
      }

      const quantity = usdtAmount / entryPrice;

      const newPosition = {
        id: Date.now(),
        pair,
        side, // "BUY" = long, "SELL" = short
        leverage,
        entryPrice,
        quantity,
        positionSize: usdtAmount,
        marginUsed: marginRequired,
        pnl: 0,
        liquidationPrice: 0, // we calculate next
      };

      return {
        positions: [...state.positions, newPosition],
        usedMargin: state.usedMargin + marginRequired,
      };
    }),


  closePosition: (id) =>
    set((state) => {
      const position = state.positions.find((p) => p.id === id);
      if (!position) return state;


      return {
        positions: state.positions.filter((p) => p.id !== id),
        usedMargin: state.usedMargin - position.marginUsed,
      };
    }),


  clearPositions: () =>
    set({
      positions: [],
      usedMargin: 0,
    }),


  /* ---------------- SETTERS ---------------- */


  setBalances: (spotBalances, futuresBalances) =>
    set({
      balances: {
        spot: spotBalances,
        futures: futuresBalances,
      },
    }),

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
      if (refreshed) {
        return get().fetchWallet();
      }
    }

    console.error("Wallet fetch failed:", err);
  } finally {
    set({ loading: false });
  }
},


}));