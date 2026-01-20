import { useState } from "react";
import { useWalletStore } from "../../store/walletStore";

const Transfer = () => {
  const { balances, transferFunds } = useWalletStore();

  const [from, setFrom] = useState("spot");
  const [to, setTo] = useState("futures");
  const [asset, setAsset] = useState("USDT");
  const [amount, setAmount] = useState("");

  const fromWallet = balances[from] || {};
  const toWallet = balances[to] || {};

  const available = fromWallet[asset] ?? 0;

  const handleSwap = () => {
    setFrom(to);
    setTo(from);
    setAmount("");
  };

  const handleTransfer = async () => {
    if (!amount || Number(amount) <= 0) {
      alert("Enter valid amount");
      return;
    }

    if (Number(amount) > available) {
      alert("Insufficient balance");
      return;
    }

    await transferFunds({
      from,
      to,
      asset,
      amount: Number(amount),
    });

    setAmount("");
  };

  return (
    <div className="convert">
      <div className="convert-panel">

        {/* HEADER */}
        <div className="convert-tabs">
          <button className="active">Transfer</button>
        </div>

        {/* FROM SECTION */}
        <div className="convert-section">
          <div className="convert-section-header">
            <span>From</span>
            <span className="balance">
              Balance: {available} {asset}
            </span>
          </div>

          <div className="convert-section-body">
            <span className="asset">
              {from === "spot" ? "Spot " : "Futures "}
            </span>

            <div className="convert-input">
              <input
                type="number"
                placeholder="Amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
              <span className="max-btn" onClick={() => setAmount(available)}>
                MAX
              </span>
            </div>
          </div>
        </div>

        {/* SWAP */}
        <div className="convert-swap" onClick={handleSwap}>
          ↓
        </div>

        {/* TO SECTION */}
        <div className="convert-section">
          <div className="convert-section-header">
            <span>To</span>
            <span className="balance">
              Balance: {toWallet[asset] ?? 0} {asset}
            </span>
          </div>

          <div className="convert-section-body">
            <span className="asset">
              {to === "spot" ? "Spot " : "Futures"}
            </span>
            <span className="amount">{amount || "0.00"}</span>
          </div>
        </div>

        {/* ACTION */}
        <button className="convert-btn" onClick={handleTransfer}>
          Transfer
        </button>

      </div>
    </div>
  );
};

export default Transfer;
