import { NavLink, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

function Navbar() {

  const location = useLocation();

  // Zustand auth state
  const { accessToken, email, logout, openAuth } = useAuthStore();

  // Detect parent tab active
  const isTradeActive =
    location.pathname.startsWith("/spot") ||
    location.pathname.startsWith("/futures");

  const isBuyActive = location.pathname.startsWith("/buy");

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
              <NavLink to="/spot" className={({ isActive }) => isActive ? "dropdown-link active" : "dropdown-link"}>
                <h3>Trade Spot</h3>
                <p>Buy crypto using USDT</p>
              </NavLink>
            </li>
            <li>
              <NavLink to="/futures" className={({ isActive }) => isActive ? "dropdown-link active" : "dropdown-link"}>
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
            {/* same links you already had */}
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
