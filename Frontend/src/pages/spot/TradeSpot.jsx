import Sidebar from "../../components/Sidebar";
import TradingViewWidget from "../../components/TradingViewWidget";
import { cryptoPairs } from "../../data/cryptoPrices";

const TradeSpot = () => {
  return (
    <div className="tradespot">

      <Sidebar data={cryptoPairs} />

      {/* MAIN PANEL */}
      <div className="main">

        <div className="chart">
          <TradingViewWidget />
        </div>

        <div className="TransactionBar">

          <div className="tx-order-type">
            <button className="tx-type active">Market</button>
            <button className="tx-type">Limit</button>
            <button className="tx-type">Stop Limit</button>
          </div>

          <div className="tx-input">
            <input type="text" placeholder="Price" />
            <div className="tx-input-suffix">Market Price</div>
          </div>

          <div className="tx-input">
            <input type="text" placeholder="Amount" />
            <div className="tx-input-suffix">USDT</div>
          </div>

          <div className="tx-balance">Available: -- USDT</div>

          <div className="tx-actions">
            <button className="tx-btn-buy">Buy</button>
            <button className="tx-btn-sell">Sell</button>
          </div>

        </div>



      </div>

    </div>
  );
};

export default TradeSpot;
