import { create } from "zustand";

export const useMarketStore = create((set) => ({

  selectedPair: "BTCUSDT",


  prices: {},


  setPair: (pair) => set({ selectedPair: pair }),

  // update price for ONE symbol
  updatePrice: (symbol, data) =>
    set((state) => ({
      prices: {
        ...state.prices,
        [symbol]: data,
      },
    })),

}));
