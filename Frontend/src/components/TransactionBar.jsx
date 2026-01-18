import { useState } from "react";
import { useMarketStore } from "../store/marketStore";
import { useWalletStore } from "../store/walletStore";

const TransactionBar = ({ mode = "spot" }) => {
  const isFutures = mode === "futures";

  // UI-only state
  const [orderType, setOrderType] = useState("market"); // market | limit
  const [amount, setAmount] = useState("");

  // selected pair from global market store
  const selectedPair = useMarketStore((s) => s.selectedPair);
  const prices = useMarketStore((s) => s.prices);

  const price = prices[selectedPair]?.price;

  const estimatedQuantity =
    amount && price ? Number(amount) / Number(price) : null;

  // BTCUSDT → BTC/USDT
  const displayPair = selectedPair.replace("USDT", "/USDT");

  // base coin (BTCUSDT -> BTC)
  const baseCoin = selectedPair.replace("USDT", "");

  // balances
  const balances = useWalletStore((s) => s.balances);
  const usdtBalance = balances["USDT"] ?? 0;
  const baseCoinBalance = balances[baseCoin] ?? 0;
  const usdtInsufficientBalance = Number(amount) > Number(usdtBalance);



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

      <div className="tx-input">
        <input
          type="number"
          min="0"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        <div className="tx-input-suffix">USDT</div>
      </div>

      {/* BALANCES */}
      <div className="tx-balance">
        <span>
          Available: {usdtBalance.toLocaleString()} USDT
        </span>

        <span>
          {baseCoinBalance.toLocaleString()} {baseCoin}
        </span>
      </div>

      <div className="tx-actions">
        <button className="tx-btn-buy">
          <div>
            {isFutures ? `Long ${displayPair}` : `Buy ${displayPair.replace("/USDT" ,"")}`}
          </div>
          <div className="tx-estimate">
            {estimatedQuantity
              ? estimatedQuantity.toFixed(6)
              : "0.000000"}{" "}
            {baseCoin}
          </div>
        </button>

        <button className="tx-btn-sell">
          <div>
            {isFutures ? `Short ${displayPair}` : `Sell ${displayPair.replace("/USDT" ,"")}`}
          </div>
          <div className="tx-estimate">
            {estimatedQuantity
              ? estimatedQuantity.toFixed(6)
              : "0.000000"}{" "}
            {baseCoin}
          </div>
        </button>
      </div>
    </div>
  );
};

export default TransactionBar;
