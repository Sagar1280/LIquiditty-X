function Navbar() {
  return (
    <nav>
      <ul className="nav-left">
        <li className="logo">
          <a href="/">
            <img src="Essentials/Name.svg" alt="Liquidity-X" />
          </a>
        </li>

        <li className="nav-item">Market</li>

        {/* TRADE */}
        <li className="nav-item dropdown">
          <span>
            Trade
            <img
              src="Essentials/down-arrow.svg"
              className="down-arrow"
              alt=""
            />
          </span>

          <ul className="dropdown-menu">
            <li>
              <h3 className="dropdown-menu-li-header">Trade Spot</h3>
              <p>Now buy crypto with USDT</p>
            </li>
            <li>
              <h3>Trade Futures</h3>
              <p>Try Leverage Trading in USDT</p>
            </li>
          </ul>
        </li>

        {/* BUY */}
        <li className="nav-item dropdown">
          <span>
            Buy
            <img
              src="/Essentials/down-arrow.svg"
              className="down-arrow"
              alt=""
            />
          </span>

          <ul className="dropdown-menu">
            <li>
              <h3>Buy with Crypto</h3>
              <p>Now buy crypto with Crypto</p>
            </li>
            <li>
              <h3>Convert Crypto</h3>
              <p>Crypto to Crypto Conversion becomes easier</p>
            </li>
          </ul>
        </li>

        {/* TOOLS */}
        <li className="nav-item dropdown">
          <span>
            Tools
            <img
              src="Essentials/down-arrow.svg"
              className="down-arrow"
              alt=""
            />
          </span>

          <ul className="dropdown-menu">
            <li>
              <h3>Trading View</h3>
              <p>Ultimate chart Viewer with mulitple options</p>
            </li>
            <li>
              <h3>Coinglass</h3>
              <p>A powerful Tool for analysis of heatmaps , liqduidty and more</p>
            </li>
            <li>
              <h3>CryptoVerse</h3>
              <p>Into the CryptoVerse - A Benjamin Cowen made tools</p>
            </li>
            <li>
              <h3>CryptoBubbles</h3>
              <p>Simplified version of showing all crypto prices in small bubbles to identify trends</p>
            </li>
          </ul>
        </li>
      </ul>

      <ul className="ul-nav-right">
        <li>
          <button className="button1">Sign In / Login</button>
        </li>
        <li className="lang-opt">English</li>
      </ul>

      <div className="hamburger">☰</div>
    </nav>
  );
}

export default Navbar;
