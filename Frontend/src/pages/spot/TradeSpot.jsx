import TradingViewWidget from "../../components/TradingViewWidget";
import { cryptoPairs } from "../../data/cryptoPrices";

const TradeSpot = () => {
  return (
    <div className="tradespot">


      <div className="sidebar">

        <div className="sidebar-header">
          <span>Crypto</span>
          <span>Price</span>
          <span>24h</span>
        </div>

        {/* Crypto list */}
        <div className="crypto_pairs">
          {cryptoPairs.map((pair, index) => (
            <div className="pair-row" key={index}>

              <div className="pair-info">
                <img className="pair-logo" src={pair.logo} alt={pair.symbol} />
                <span>{pair.symbol}</span>
              </div>

              <div className="pair-price">${pair.price}</div>

              <div
                className={`pair-change ${pair.change >= 0 ? "pos" : "neg"}`}
              >
                {pair.change > 0 && "+"}{pair.change}%
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* MAIN PANEL */}
      <div className="main">

        <div className="chart">
          <TradingViewWidget />
        </div>

        <div className="TransactionSpotBar"></div>

      </div>

    </div>
  );
};

export default TradeSpot;
