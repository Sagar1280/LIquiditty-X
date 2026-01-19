import { useMarketStore } from "../store/marketStore";

const SPOT_WS = "wss://stream.binance.com:9443/stream";
const FUTURES_WS = "wss://fstream.binance.com/stream";


const symbols = [
  "btcusdt", "ethusdt", "solusdt", "bnbusdt", "xrpusdt", "adausdt",
  "dogeusdt", "avaxusdt", "trxusdt", "xlmusdt", "linkusdt", "suiusdt",
  "bchusdt", "hbarusdt", "ltcusdt", "nearusdt", "pepeusdt", "uniusdt",
  "aptusdt", "icpusdt",
];

const buildUrl = (base) =>
  base + "?streams=" + symbols.map((s) => `${s}@ticker`).join("/");

let socket = null;

export const startMarketSocket = (mode = "spot") => {
  if (socket) socket.close(); // 🔥 close previous socket

  const url = mode === "futures"
    ? buildUrl(FUTURES_WS)
    : buildUrl(SPOT_WS);

  socket = new WebSocket(url);

  socket.onmessage = (event) => {
    const msg = JSON.parse(event.data);
    const data = msg.data;
    if (!data) return;

    useMarketStore.getState().updatePrice(
      data.s.toUpperCase(),
      {
        price: parseFloat(data.c),
        change: parseFloat(data.P),
      }
    );
  };

  socket.onerror = (err) => console.error("Market WS error", err);
  socket.onclose = () => console.warn("Market WS closed");

  return socket;
};
