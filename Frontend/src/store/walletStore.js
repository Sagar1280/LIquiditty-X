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
    return state.getFuturesBalance() - state.usedMargin;
  },

  /* ---------------- POSITION MANAGEMENT ---------------- */

  openPosition: ({ pair, side, leverage, entryPrice, usdtAmount }) =>
    set((state) => {
      if (!entryPrice || !usdtAmount || leverage <= 0) return state;

      const takerFeeRate = 0.0004;
      const openFee = usdtAmount * takerFeeRate;

      const marginRequired = usdtAmount / leverage;

      const totalBalance = state.getFuturesBalance();
      const available = totalBalance - state.usedMargin;

      if (marginRequired + openFee > available) {
        console.log("Insufficient balance (including fee)");
        return state;
      }

      const quantity = usdtAmount / entryPrice;

      const maintenanceMarginRate = 0.005;

      let liquidationPrice = 0;

      if (side === "BUY") {
        liquidationPrice =
          entryPrice *
          (1 - 1 / leverage + maintenanceMarginRate);
      } else {
        liquidationPrice =
          entryPrice *
          (1 + 1 / leverage - maintenanceMarginRate);
      }

      const newPosition = {
        id: Date.now(),
        pair,
        side,
        leverage,
        entryPrice,
        quantity,
        positionSize: usdtAmount,
        marginUsed: marginRequired,
        pnl: 0,
        liquidationPrice,
        openFee,
      };

      return {
        positions: [...state.positions, newPosition],
        usedMargin: state.usedMargin + marginRequired,
        balances: {
          ...state.balances,
          futures: {
            ...state.balances.futures,
            USDT: totalBalance - openFee, // ONLY fee deducted
          },
        },
      };
    }),

  updatePnL: (currentPrice, pair) =>
    set((state) => ({
      positions: state.positions.map((pos) => {
        if (pos.pair !== pair) return pos;

        let pnl = 0;

        if (pos.side === "BUY") {
          pnl = (currentPrice - pos.entryPrice) * pos.quantity;
        } else {
          pnl = (pos.entryPrice - currentPrice) * pos.quantity;
        }

        return { ...pos, pnl };
      }),
    })),

  closePosition: (id) =>
    set((state) => {
      const position = state.positions.find((p) => p.id === id);
      if (!position) return state;

      const takerFeeRate = 0.0004;
      const closeFee = position.positionSize * takerFeeRate;

      const realizedPnL = position.pnl - closeFee;

      const totalBalance = state.getFuturesBalance();

      const updatedBalance =
        totalBalance + realizedPnL;

      return {
        positions: state.positions.filter((p) => p.id !== id),
        usedMargin: state.usedMargin - position.marginUsed,
        balances: {
          ...state.balances,
          futures: {
            ...state.balances.futures,
            USDT: updatedBalance,
          },
        },
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
        if (refreshed) return get().fetchWallet();
      }

      console.error("Wallet fetch failed:", err);
    } finally {
      set({ loading: false });
    }
  },
}));