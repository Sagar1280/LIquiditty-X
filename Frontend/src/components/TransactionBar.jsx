import { useState } from "react";
import { useEffect } from "react";
import { useMarketStore } from "../store/marketStore";
import { startMarketSocket } from "../data/marketSocket";
import { useWalletStore } from "../store/walletStore";
import { useAuthStore } from "../store/authStore";
import axios from "axios";


const TransactionBar = ({ mode = "spot" }) => {
  const isFutures = mode === "futures";
  const setMarketMode = useMarketStore((s)=> s.setMarketMode);

  // UI-only state
  const [orderType, setOrderType] = useState("market"); // market | limit
  const [amount, setAmount] = useState("");
  const [inputAsset, setInputAsset] = useState("USDT"); // USDT | BASE

  // selected pair from global market store
  const selectedPair = useMarketStore((s) => s.selectedPair);
  const prices = useMarketStore((s) => s.prices);

  const price = prices[selectedPair]?.price;

  // BTCUSDT → BTC/USDT
  const baseCoin = selectedPair.replace("USDT", "");
  const displayPair = `${baseCoin}/USDT`;

  // balances
  const balances = useWalletStore((s) => s.balances);
  const usdtBalance = balances["USDT"] ?? 0;
  const baseCoinBalance = balances[baseCoin] ?? 0;


  const isBuyMode = inputAsset === "USDT";
  const isSellMode = inputAsset === baseCoin;


  // balance validation
  const isInsufficientBalance = isBuyMode
    ? Number(amount) > usdtBalance
    : Number(amount) > baseCoinBalance;

  // quantity estimate
  const estimatedQuantity =
    isBuyMode && amount && price
      ? (Number(amount) / price).toFixed(6)
      : isSellMode
        ? Number(amount || 0).toFixed(6)
        : "0.000000";

  const fetchWallet = useWalletStore((s) => s.fetchWallet);
  const { accessToken, refresh } = useAuthStore();

  const executeTrade = async (side) => {
  try {
    const { accessToken } = useAuthStore.getState();

    await axios.post(
      "/trade/spot",
      {
        side,
        baseCoin,
        amount: Number(amount),
        price,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    fetchWallet();
    setAmount("");

  } catch (err) {
    if (err.response?.status === 401) {
      const refreshed = await useAuthStore.getState().refresh();

      if (refreshed) {
        // 🔥 retry ONCE with NEW token
        const { accessToken: newToken } = useAuthStore.getState();

        await axios.post(
          "/trade/spot",
          {
            side,
            baseCoin,
            amount: Number(amount),
            price,
          },
          {
            headers: {
              Authorization: `Bearer ${newToken}`,
            },
          }
        );

        fetchWallet();
        setAmount("");
        return;
      }
    }

    console.error("Trade failed:", err);
  }
};

  


  return (
    <div className="TransactionBar">
      <div className="futures-tx-order-type">
        <div className="tx-order-type">
          <button
            className={`tx-type ${orderType === "market" ? "active" : ""}`}
            onClick={() => setOrderType("market")}
          >
            Market
          </button>

          <button
            className={`tx-type ${orderType === "limit" ? "active" : ""}`}
            onClick={() => setOrderType("limit")}
          >
            Limit
          </button>
        </div>

        {isFutures && (
          <div className="tx-leverage">
            <button className="leverage-type">Cross</button>
            <button className="leverage-btn">20x</button>
          </div>
        )}
      </div>

      <div className="tx-input">
        <input
          type="number"
          placeholder={orderType === "market" ? "Market Price" : "Price"}
          disabled={orderType === "market"}
        />
        {orderType === "market" && (
          <div className="tx-input-suffix">Market</div>
        )}
      </div>

      {/* AMOUNT INPUT */}
      <div className={`tx-input ${isInsufficientBalance ? "tx-input-error" : ""}`}>
        <input
          type="number"
          min="0"
          placeholder={`Amount (${inputAsset})`}
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        <div
          className="tx-input-suffix clickable"
          onClick={() =>
            setInputAsset(inputAsset === "USDT" ? baseCoin : "USDT")
          }
        >
          {inputAsset}
        </div>
      </div>

      {/* BALANCES */}
      <div className="tx-balance">
        <span>Available: {usdtBalance.toLocaleString()} USDT</span>
        <span>{baseCoinBalance.toLocaleString()} {baseCoin}</span>
      </div>

      {/* ACTIONS */}
      <div className="tx-actions">
        <button
          className="tx-btn-buy"
          disabled={!isBuyMode || isInsufficientBalance || !amount}
          onClick={() => executeTrade("BUY")}
        >
          <div>{isFutures ? `Long ${displayPair}` : `Buy ${baseCoin}`}</div>
          <div className="tx-estimate">
            {estimatedQuantity} {baseCoin}
          </div>
        </button>

        <button
          className="tx-btn-sell"
          disabled={!isSellMode || isInsufficientBalance || !amount}
          onClick={() => executeTrade("SELL")}
        >
          <div>{isFutures ? `Short ${displayPair}` : `Sell ${baseCoin}`}</div>
          <div className="tx-estimate">
            {estimatedQuantity} {baseCoin}
          </div>
        </button>
      </div>
    </div>
  );
};

export default TransactionBar;
