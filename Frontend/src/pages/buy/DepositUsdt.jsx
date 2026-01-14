import React, { useState } from "react";
import {  cryptoPairs1 } from "../../data/cryptoPrices";

const DepositUsdt = () => {
  const [balances, setBalances] = useState({
    BTC: 0,
    ETH: 0,
    SOL: 0,
    USDT: 0,
  });

  const dailyLimits = {
    BTC: 0.1,
    ETH: 2,
    SOL: 20,
    USDT: 10000,
  };

  // filter only deposit assets:
  const depositAssets = cryptoPairs1.filter(asset =>
    ["BTC", "ETH", "SOL", "USDT"].includes(asset.symbol)
  );

  const handleDeposit = (asset) => {
    let amount = prompt(`Deposit amount (${asset}):`);
    if (!amount || isNaN(amount)) return;

    amount = parseFloat(amount);

    if (amount + balances[asset] > dailyLimits[asset]) {
      alert(div.jhsjdah);
      return;
    }

    setBalances({ ...balances, [asset]: balances[asset] + amount });
  };

  return (
    <div className="deposit-container">

      <div className="deposit-header">
        <h2>Deposit Crypto</h2>
        <div className="deposit-info">
          <div className="timer-box">Reset: 23:45:12</div>
          <div className="limit-box">Daily Limit: $10,000 USDT</div>
        </div>
      </div>

      <div className="deposit-grid">
        {depositAssets.map(asset => (
          <div className="asset-card" key={asset.symbol}>
            
            <div className="asset-top">
              <img src={asset.logo} className="asset-icon" />
              <h3>{asset.symbol}</h3>
            </div>

            <p className="limit">
              Daily: {dailyLimits[asset.symbol]} {asset.symbol}
            </p>

            <div className="deposit-display">
              Balance: {balances[asset.symbol]} {asset.symbol}
            </div>

            <button
              className="deposit-btn"
              onClick={() => handleDeposit(asset.symbol)}
            >
              Deposit
            </button>

          </div>
        ))}
      </div>
    </div>
  );
};

export default DepositUsdt;
