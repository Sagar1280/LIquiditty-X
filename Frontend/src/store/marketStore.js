import { create } from "zustand";

export const useMarketStore = create((set) => ({

  selectedPair: "BTCUSDT",
  
  marketMode : "spot",


  prices: {},

  setPair: (pair) => set({ selectedPair: pair }),
  setMarketMode: (mode) => set({ marketMode: mode }),

  // update price for ONE symbol
  updatePrice: (symbol, data) =>
    set((state) => ({
      prices: {
        ...state.prices,
        [symbol]: data,
      },
    })),

  clearPrices: () => set({ prices: {} }),

}));
