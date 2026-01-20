import { useWalletStore } from "../../store/walletStore";
import { cryptoPairs } from "../../data/cryptoPrices";

const FuturesWallet = () => {
  const balances = useWalletStore((s) => s.balances.futures || {});

 
  const logoMap = [...cryptoPairs].reduce((acc, coin) => {
    acc[coin.symbol.replace("/USDT","")] = coin.logo;
    return acc;
  }, {});

  const assets = Object.entries(balances);

  return (
    <div className="wallet-page">
      <h2 className="wallet-title">Futures Wallet</h2>

      {assets.length === 0 ? (
        <div className="wallet-empty">No assets in futures wallet</div>
      ) : (
        <div className="wallet-table">
          <div className="wallet-table-header">
            <span>Asset</span>
            <span>Balance</span>
          </div>

          {assets.map(([asset, balance]) => (
            <div className="wallet-row" key={asset}>
              <div className="wallet-asset with-logo">
                <img
                  src={logoMap[asset] || "/Essentials/default-coin.png"}
                  alt={asset}
                  className="wallet-coin-logo"
                />
                <span>{asset}</span>
              </div>

              <span className="wallet-balance">
                {Number(balance).toFixed(6)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FuturesWallet;
