import { useState } from "react";
import { useMarketStore } from "../store/marketStore";

const TransactionBar = ({ mode = "spot" }) => {
  const isFutures = mode === "futures";

  // UI-only state
  const [orderType, setOrderType] = useState("market"); // market | limit 

  // selected pair from global market store
  const selectedPair = useMarketStore((s) => s.selectedPair);

  // BTCUSDT → BTC/USDT
  const displayPair = selectedPair.replace("USDT", "/USDT");

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
        <input type="number" placeholder="Amount" />
        <div className="tx-input-suffix">USDT</div>
      </div>

  
      <div className="tx-balance">
        Available: -- USDT
      </div>

   
      <div className="tx-actions">
        <button className="tx-btn-buy">
          {isFutures ? `Long ${displayPair}` : `Buy ${displayPair}`}
        </button>

        <button className="tx-btn-sell">
          {isFutures ? `Short ${displayPair}` : `Sell ${displayPair}`}
        </button>
      </div>

    </div>
  );
};

export default TransactionBar;
