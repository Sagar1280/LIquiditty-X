import { useWalletStore } from "../store/walletStore";
import { useMarketStore } from "../store/marketStore";
import { useAuthStore } from "../store/authStore";
import axios from "axios";

const FuturesPositions = () => {
  const positions = useWalletStore((s) => s.positions);
  const fetchPositions = useWalletStore((s) => s.fetchPositions);
  const fetchWallet = useWalletStore((s) => s.fetchWallet);

  const prices = useMarketStore((s) => s.prices);

  const accessToken = useAuthStore((s) => s.accessToken);
  const refresh = useAuthStore((s) => s.refresh);

  const handleClose = async (pos) => {
    try {
      const currentMarketPrice = prices[pos.pair]?.price;
      if (!currentMarketPrice) return;

      await axios.post(
        "/trade/futures/close",
        {
          positionId: pos._id,
          currentPrice: currentMarketPrice,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      await fetchPositions();
      await fetchWallet();

    } catch (err) {
      if (err.response?.status === 401) {
        const refreshed = await refresh();
        if (refreshed) return handleClose(pos);
      }

      console.error("Close position failed", err);
    }
  };

  if (!positions?.length) return null;

  return (
    <div className="positions-panel">
      <div className="positions-header">
        Open Positions ({positions.length})
      </div>

      <div className="positions-body">
        {positions.map((pos) => {
          const entry = Number(pos.entryPrice ?? 0);
          const quantity = Number(pos.quantity ?? 0);
          const leverage = Number(pos.leverage ?? 1);
          const liq = Number(pos.liquidationPrice ?? 0);
          const marginUsed = Number(pos.marginUsed ?? 0);

          const currentPrice = prices[pos.pair]?.price ?? entry;

          let pnl = 0;

          if (pos.side === "BUY") {
            pnl = (currentPrice - entry) * quantity;
          } else {
            pnl = (entry - currentPrice) * quantity;
          }

          const roe = marginUsed
            ? ((pnl / marginUsed) * 100).toFixed(2)
            : 0;

          return (
            <div
              key={pos._id}
              className={`position-row ${
                pos.side === "BUY" ? "long" : "short"
              }`}
            >
              <span>{pos.pair}</span>
              <span>{pos.side === "BUY" ? "LONG" : "SHORT"}</span>
              <span>{leverage}x</span>
              <span>Entry: {entry.toFixed(2)}</span>

              <span>
                PnL:{" "}
                <strong
                  style={{ color: pnl >= 0 ? "#00c076" : "#ff4d4f" }}
                >
                  {pnl.toFixed(2)} USDT
                </strong>
              </span>

              <span>
                ROE:{" "}
                <strong
                  style={{ color: roe >= 0 ? "#00c076" : "#ff4d4f" }}
                >
                  {roe}%
                </strong>
              </span>

              <span>Liq: {liq.toFixed(2)}</span>

              <button onClick={() => handleClose(pos)}>
                Close
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FuturesPositions;