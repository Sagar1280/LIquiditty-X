import TradingViewWidget from "../../components/TradingViewWidget";
import { cryptoPairs } from "../../data/cryptoPrices";


const TradeSpot = () => {
  return (
    <div className="tradespot">

      <div className="sidebar">
        
        {/* Header */}
        <div className="sidebar-header">
          <div>Crypto</div>
          <div>Price</div>
          <div>24h</div>
        </div>

        {/* Crypto pairs list */}
        <div className="crypto_pairs">

          {cryptoPairs.map((pair, index) => (

            <div className="pair-row" key={index}>

                 <div>{pair.symbol}</div>

                 <div>${pair.price}</div>

                 <div className={pair.change >= 0 ? "pos" : "neg"}>
                 {pair.change > 0 ? "+" : ""}
                 {pair.change}%
                 </div>

            </div>
          )
          )
          }

        </div>


      </div>

      <div className="main">

        <div className="chart">
          <TradingViewWidget />
        </div>

        <div className="TransactionSpotBar">

        </div>

      </div>

    </div>
  );
};

export default TradeSpot;
