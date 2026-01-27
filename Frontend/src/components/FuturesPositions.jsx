import { useWalletStore } from "../store/walletStore";
import { useMarketStore } from "../store/marketStore";
import { useEffect } from "react";

const FuturesPositions = () => {
  const positions = useWalletStore((s) => s.positions);
  const closePosition = useWalletStore((s) => s.closePosition);
  const updatePnL = useWalletStore((s) => s.updatePnL);

  const prices = useMarketStore((s) => s.prices);

  useEffect(() => {
    positions.forEach((pos) => {
      const currentPrice = prices[pos.pair]?.price;
      if (currentPrice) {
        updatePnL(currentPrice, pos.pair);
      }
    });
  }, [prices]);

  if (!positions.length) return null;

  return (
    <div className="positions-panel">
      <div className="positions-header">
        Open Positions ({positions.length})
      </div>

      <div className="positions-body">
        {positions.map((pos) => (
          <div
            key={pos.id}
            className={`position-row ${
              pos.side === "BUY" ? "long" : "short"
            }`}
          >
            <span>{pos.pair}</span>
            <span>{pos.side === "BUY" ? "LONG" : "SHORT"}</span>
            <span>{pos.leverage}x</span>
            <span>Entry: {pos.entryPrice.toFixed(2)}</span>
            <span>
              PnL:{" "}
              <strong
                style={{
                  color: pos.pnl >= 0 ? "#00c076" : "#ff4d4f",
                }}
              >
                {pos.pnl.toFixed(2)} USDT
              </strong>
            </span>
            <span>
              Liq: {pos.liquidationPrice.toFixed(2)}
            </span>
            <button onClick={() => closePosition(pos.id)}>
              Close
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FuturesPositions;