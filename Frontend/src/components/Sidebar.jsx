import { useMarketStore } from "../store/marketStore";
// ❌ TradingViewWidget import not needed in Sidebar (removed)

const Sidebar = ({ data }) => {


  const setPair = useMarketStore((s) => s.setPair);
  const selectedPair = useMarketStore((s) => s.selectedPair);
  const prices = useMarketStore((s) => s.prices);


  return (
    <div className="sidebar">

      <div className="sidebar-header">
        <span>Crypto</span>
        <span>Price</span>
        <span>24h</span>
      </div>

      {/* Crypto list */}
      <div className="crypto_pairs">
        {data.map((pair, index) => {

          // convert "BTC/USDT" → "BTCUSDT"
          const symbol = pair.symbol.replace("/", "");
          const priceData = prices[symbol];


          return (
            <div
              key={index}
              onClick={() => setPair(symbol)}
              className={`pair-row ${selectedPair === symbol ? "active-pair" : ""
                }`}
            >

              <div className="pair-info">
                <img
                  className="pair-logo"
                  src={pair.logo}
                  alt={pair.symbol}
                />
                <span>{pair.symbol}</span>
              </div>

              <div className="pair-price">
                {priceData
                  ? `$${Number(priceData.price).toLocaleString()}`
                  : "--"}

              </div>

              <div
                className={`pair-change ${priceData?.change >= 0 ? "pos" : "neg"
                  }`}
              >
                {priceData
                  ? `${priceData.change > 0 ? "+" : ""}${priceData.change}%`
                  : "--"}
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};

export default Sidebar;
