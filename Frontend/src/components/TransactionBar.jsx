import { useState } from "react";
import { useMarketStore } from "../store/marketStore";
import { useWalletStore } from "../store/walletStore";
import { useAuthStore } from "../store/authStore";
import axios from "axios";

const TransactionBar = ({ mode = "spot" }) => {
  const isFutures = mode === "futures";

  /* ---------------- UI STATE ---------------- */
  const [orderType, setOrderType] = useState("market");
  const [amount, setAmount] = useState("");
  const [inputAsset, setInputAsset] = useState("USDT");
  const [leverage, setLeverage] = useState(1);
  const [Fmode, setFmode] = useState("Cross");

  /* ---------------- MARKET STATE ---------------- */
  const selectedPair = useMarketStore((s) => s.selectedPair);
  const prices = useMarketStore((s) => s.prices);
  const price = prices[selectedPair]?.price;

  const baseCoin = selectedPair.replace("USDT", "");
  const displayPair = `${baseCoin}/USDT`;

  /* ---------------- WALLET STATE ---------------- */
  const balances = useWalletStore((s) => s.balances);
  const fetchWallet = useWalletStore((s) => s.fetchWallet);
  const openPosition = useWalletStore((s) => s.openPosition);

  const getAvailableFuturesBalance = useWalletStore(
    (s) => s.getAvailableFuturesBalance
  );

  const usdtBalance = isFutures
    ? getAvailableFuturesBalance()
    : balances?.spot?.["USDT"] ?? 0;

  const baseCoinBalance = balances?.spot?.[baseCoin] ?? 0;

  /* ---------------- MODE LOGIC ---------------- */

  const isBuyMode = isFutures ? true : inputAsset === "USDT";
  const isSellMode = isFutures ? true : inputAsset === baseCoin;

  /* ---------------- ESTIMATION ---------------- */

  const estimatedQuantity =
    amount && price
      ? (Number(amount) / price).toFixed(6)
      : "0.000000";

  const positionSizeUSDT = Number(amount || 0);

  const marginRequired = isFutures
    ? positionSizeUSDT / leverage
    : 0;

  const marginPercent = isFutures
    ? (1 / leverage) * 100
    : 0;

  const isInsufficientFuturesBalance =
    isFutures && marginRequired > usdtBalance;

  const isInsufficientBalance = isFutures
    ? isInsufficientFuturesBalance
    : isBuyMode
      ? Number(amount) > usdtBalance
      : Number(amount) > baseCoinBalance;

  /* ---------------- AUTH ---------------- */
  const { refresh } = useAuthStore();

  /* ---------------- TRADE EXECUTION ---------------- */

  const executeTrade = async (side) => {
    try {
      const { accessToken } = useAuthStore.getState();

      if (isFutures) {
        if (!price || !amount) return;

        openPosition({
          pair: selectedPair,
          side,
          leverage,
          entryPrice: price,
          usdtAmount: Number(amount),
        });

        setAmount("");
        return;
      }

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
        const refreshed = await refresh();

        if (refreshed) {
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

  /* ---------------- UI ---------------- */

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
            <button
              className="leverage-type"
              onClick={() =>
                setFmode(Fmode === "Cross" ? "Isolated" : "Cross")
              }
            >
              {Fmode}
            </button>

            <button
              className="leverage-btn"
              onClick={() =>
                setLeverage(leverage === 20 ? 1 : leverage + 1)
              }
            >
              {leverage}x
            </button>
          </div>
        )}
      </div>

      {/* PRICE INPUT */}
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
          placeholder={`Amount (${isFutures ? "USDT" : inputAsset})`}
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        {!isFutures && (
          <div
            className="tx-input-suffix clickable"
            onClick={() =>
              setInputAsset(inputAsset === "USDT" ? baseCoin : "USDT")
            }
          >
            {inputAsset}
          </div>
        )}

        {isFutures && (
          <div className="tx-input-suffix">USDT</div>
        )}
      </div>

      {/* BALANCES */}
      <div className="tx-balance">
        <span>Available: {usdtBalance.toLocaleString()} USDT</span>
        {!isFutures && (
          <span>
            {baseCoinBalance.toLocaleString()} {baseCoin}
          </span>
        )}
      </div>

      {isFutures && amount && (
        <div className="tx-margin-info">
          <div>Margin Used: {marginRequired.toFixed(2)} USDT</div>
          <div>Margin %: {marginPercent.toFixed(2)}%</div>
        </div>
      )}

      {/* ACTIONS */}
      <div className="tx-actions">
        <button
          className="tx-btn-buy"
          disabled={isInsufficientBalance || !amount}
          onClick={() => executeTrade("BUY")}
        >
          <div>{isFutures ? `Long ${displayPair}` : `Buy ${baseCoin}`}</div>
          <div className="tx-estimate">
            {estimatedQuantity} {baseCoin}
          </div>
        </button>

        <button
          className="tx-btn-sell"
          disabled={isInsufficientBalance || !amount}
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