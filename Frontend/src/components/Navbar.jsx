import { NavLink, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { useWalletStore } from "../store/walletStore";
import { useEffect } from "react";
import { useMarketStore } from "../store/marketStore";



function Navbar() {

  const location = useLocation();
  // Zustand auth state

  const { accessToken, email, logout, openAuth } = useAuthStore();  

  // Detect parent tab active 
  const isTradeActive =
    location.pathname.startsWith("/spot") ||
    location.pathname.startsWith("/futures");

  const isBuyActive = location.pathname.startsWith("/buy");
  const marketMode = useMarketStore((s) => s.marketMode);
  const setMarketMode = useMarketStore((s) => s.setMarketMode);


  return (
    <nav className="navbar">

      {/* LEFT MENU */}
      <ul className="nav-menu nav-menu-left">

        <li className="nav-logo">
          <NavLink to="/">
            <img src="/Essentials/Name.svg" alt="Liquidity-X" />
          </NavLink>
        </li>

        <li className="nav-item">Market</li>

        {/* TRADE */}
        <li className={`nav-item nav-dropdown ${isTradeActive ? "active" : ""}`}>
          <span className="nav-dropdown-trigger">
            Trade
            <img src="/Essentials/down-arrow.svg" className="nav-arrow" alt="dropdown" />
          </span>

          <ul className="nav-dropdown-menu">
            <li>
              <NavLink to="/spot" 
              onClick={() => setMarketMode("spot")}
              className={({ isActive }) => isActive ? "dropdown-link active" : "dropdown-link"
              }>
                <h3>Trade Spot</h3>
                <p>Buy crypto using USDT</p>
              </NavLink>
            </li>
            <li>
              <NavLink to="/futures" 
              onClick={() => setMarketMode("futures")}
              className={({ isActive }) => isActive ? "dropdown-link active" : "dropdown-link"}
              >
                <h3>Trade Futures</h3>
                <p>Leverage trading in USDT</p>
              </NavLink>
            </li>
          </ul>
        </li>

        {/* BUY */}
        <li className={`nav-item nav-dropdown ${isBuyActive ? "active" : ""}`}>
          <span className="nav-dropdown-trigger">
            Buy
            <img src="/Essentials/down-arrow.svg" className="nav-arrow" alt="dropdown" />
          </span>

          <ul className="nav-dropdown-menu">
            <li>
              <NavLink to="/buy/depositUsdt" className={({ isActive }) => isActive ? "dropdown-link active" : "dropdown-link"}>
                <h3>Deposit Usdt</h3>
                <p>Crypto-to-crypto purchase</p>
              </NavLink>
            </li>
            <li>
              <NavLink to="/buy/convert" className={({ isActive }) => isActive ? "dropdown-link active" : "dropdown-link"}>
                <h3>Convert</h3>
                <p>Instant crypto conversion</p>
              </NavLink>
            </li>
          </ul>
        </li>

        {/* TOOLS */}
        <li className="nav-item nav-dropdown">
          <span className="nav-dropdown-trigger">
            Tools
            <img src="/Essentials/down-arrow.svg" className="nav-arrow" alt="dropdown" />
          </span>
          <ul className="nav-dropdown-menu tools">
             <li>
              <a
                href="https://in.tradingview.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="dropdown-link"
              >
                <h3>TradingView</h3>
                <p>Super-charting platform for investors</p>
              </a>
            </li>
             <li>
              <a
                href="https://www.coinglass.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="dropdown-link"
              >
                <h3>Coinglass</h3>
                <p>Liquidity & liquidation data</p>
              </a>
            </li>

            <li>
              <a
                href="https://intothecryptoverse.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="dropdown-link"
              >
                <h3>CryptoVerse</h3>
                <p>On-chain & cycle analysis</p>
              </a>
            </li>

            <li>
              <a
                href="https://coinmarketcap.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="dropdown-link"
              >
                <h3>CryptoMarketCap</h3>
                <p>Wide Range of Cryptocurrencies Available to Track</p>
              </a>
            </li>

            <li>
              <a
                href="https://defillama.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="dropdown-link"
              >
                <h3>DefiLamma</h3>
                <p> Best for DeFi insight</p>
              </a>
            </li>

            <li>
              <a
                href="https://dune.com/home"
                target="_blank"
                rel="noopener noreferrer"
                className="dropdown-link"
              >
                <h3>Dune Analytics</h3>
                <p> All-in-one crypto data platform</p>
              </a>
            </li>
            
          </ul>
        </li>

      </ul>

      {/* RIGHT MENU */}
      <ul className="nav-menu nav-menu-right">

        {accessToken ? (
          <>
            <li className="login-welcome">
              Welcome {email}
            </li>
            <li>
              <button className="btn-primary" onClick={logout}>
                Logout
              </button>
            </li>
          </>
        ) : (
          <li>
            <button className="btn-primary" onClick={() => openAuth("login")}>
              Sign In
            </button>
          </li>
        )}

        <li className="nav-language">English</li>
      </ul>

      <div className="nav-hamburger">☰</div>
    </nav>
  );
}

export default Navbar;
