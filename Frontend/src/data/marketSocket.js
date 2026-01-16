import { useMarketStore } from "../store/marketStore";


// Binance WebSocket base URL
const BINANCE_WS = "wss://stream.binance.com:9443/stream";

// symbols we want prices for
const symbols = [
  "btcusdt",
  "ethusdt",
  "solusdt",
  "bnbusdt",
  "xrpusdt",
  "adausdt",
  "dogeusdt",
  "avaxusdt",
  "trxusdt",
  "xlmusdt",
  "linkusdt",
  "suiusdt",
  "bchusdt",
  "hbarusdt",
  "ltcusdt",
  "nearusdt",
  "pepeusdt",
  "uniusdt",
  "apt/usdt",
  "aptusdt",
  "icpusdt",
];

// build combined stream URL
const streamUrl =
  BINANCE_WS +
  "?streams=" +
  symbols.map((s) => `${s}@ticker`).join("/");

// start WebSocket connection
export const startMarketSocket = () => {

  const socket = new WebSocket(streamUrl);

  socket.onmessage = (event) => {
    const message = JSON.parse(event.data);
    const data = message.data;

    if (!data) return;

    const symbol = data.s.toUpperCase(); // BTCUSDT
    const price = parseFloat(data.c);    // last price
    const change = parseFloat(data.P);   // 24h %

    // update Zustand store
    useMarketStore.getState().updatePrice(symbol, {
      price,
      change,
    });
  };

  socket.onerror = (err) => {
    console.error("Market WebSocket error", err);
  };

  socket.onclose = () => {
    console.warn("Market WebSocket closed");
  };

  return socket;
};
