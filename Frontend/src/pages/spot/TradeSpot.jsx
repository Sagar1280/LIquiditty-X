import Sidebar from "../../components/Sidebar";
import TradingViewWidget from "../../components/TradingViewWidget";
import { cryptoPairs } from "../../data/cryptoPrices";
import TransactionBar from "../../components/TransactionBar";

const TradeSpot = () => {
  return (
    <div className="tradespot">

      <Sidebar data={cryptoPairs} />

      {/* MAIN PANEL */}
      <div className="main">

        <div className="chart">
          <TradingViewWidget />
        </div>

        <TransactionBar mode="spot" />

        </div>

    </div>
  );
};

export default TradeSpot;
