function Navbar() {
  return (
    <nav className="navbar">
      <ul className="nav-menu nav-menu-left">
        <li className="nav-logo">
          <a href="/">
            <img src="/Essentials/Name.svg" alt="Liquidity-X" />
          </a>
        </li>

        <li className="nav-item">Market</li>

        {/* TRADE */}
        <li className="nav-item nav-dropdown">
          <span className="nav-dropdown-trigger">
            Trade
            <img
              src="/Essentials/down-arrow.svg"
              className="nav-arrow"
              alt="dropdown"
            />

          </span>

          <ul className="nav-dropdown-menu">
            <li>
              <h3>Trade Spot</h3>
              <p>Buy crypto using USDT</p>
            </li>
            <li>
              <h3>Trade Futures</h3>
              <p>Leverage trading in USDT</p>
            </li>
          </ul>
        </li>

        {/* BUY */}
        <li className="nav-item nav-dropdown">
          <span className="nav-dropdown-trigger">
            Buy
            <img
              src="/Essentials/down-arrow.svg"
              className="nav-arrow"
              alt="dropdown"
            />

          </span>

          <ul className="nav-dropdown-menu">
            <li>
              <h3>Buy with Crypto</h3>
              <p>Crypto-to-crypto purchase</p>
            </li>
            <li>
              <h3>Convert</h3>
              <p>Instant crypto conversion</p>
            </li>
          </ul>
        </li>

        {/* TOOLS */}
        <li className="nav-item nav-dropdown">
          <span className="nav-dropdown-trigger">
            Tools
            <img
              src="/Essentials/down-arrow.svg"
              className="nav-arrow"
              alt="dropdown"
            />

          </span>

          <ul className="nav-dropdown-menu">
            <li>
               <a href="https://in.tradingview.com/"
              target="_blank"
              className="nav-link"
              rel="noopener noreferrer"
              >
              <h3>TradingView</h3>
              <p>Advanced charting tools</p>
              </a>
            </li>
            <li>
               <a href="https://www.coinglass.com/"
              target="_blank"
              className="nav-link"
              rel="noopener noreferrer"
              >
              <h3>Coinglass</h3>
              <p>Coinglass - Liquidity & liquidation data</p>
              </a>
            </li>
            <li>
              <a href="https://intothecryptoverse.com/"
              target="_blank"
              className="nav-link"
              rel="noopener noreferrer"
              >
              
              <h3>CryptoVerse</h3>
              <p>On-chain & cycle analysis - Benjamin Cowen</p>
              </a>
            </li>
          </ul>
        </li>
      </ul>

      <ul className="nav-menu nav-menu-right">
        <li>
          <button className="btn-primary">Sign In</button>
        </li>
        <li className="nav-language">English</li>
      </ul>

      <div className="nav-hamburger">☰</div>
    </nav>
  );
}

export default Navbar;
