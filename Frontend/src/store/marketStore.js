import { create } from "zustand";

export const useMarketStore = create((set)=>({
    selectedPair : "BTCUSDT",
    setPair : (pair) => set({ selectedPair: pair }),

}));