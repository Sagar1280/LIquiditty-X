import Footer from "../components/Footer";

function Home() {
  return (
    <>
      {/* HERO INTRO */}
      <section className="hero-intro">
        <div className="hero-intro-text">
          <h2>
            The only way to ace trading <br /> is to practice trading.
          </h2>

          <p>
            That’s why we built <span>Liquidity-X</span> — a powerful demo trading
            platform to learn without risking real money.
          </p>
        </div>

        <div className="market-stats-card">
          <div className="market-stats-header">Popular</div>

          {[
            ["Bitcoin", "-1.52%", "neg"],
            ["Ethereum", "+0.18%", "pos"],
            ["BNB", "+0.27%", "pos"],
            ["SOL", "-0.59%", "neg"],
            ["ADA", "+1.20%", "pos"],
            ["SPX", "+10.47%", "pos"],
          ].map(([name, value, cls]) => (
            <div className="market-stat-row" key={name}>
              <span>{name}</span>
              <span className={cls}>{value}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ABOUT */}
      <section className="hero-about">
        <div className="hero-about-content">
          <div className="hero-about-text">
            <h1>
              Welcome to <span>Liquidity-X</span>
            </h1>
            <p>
              New to trading? Practice safely in an environment where mistakes
              cost nothing.
            </p>
          </div>

          <div className="hero-about-image">
            <img src="/Essentials/logo.png" alt="Liquidity-X" />
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="hero-features">
        <div className="video-container">
          <iframe
            src="https://www.youtube.com/embed/xHU5MHuUSKI?start=60"
            allowFullScreen
          />
        </div>

        <div className="feature-list">
          <div className="feature-card">
            <h3>Practice Real Trading</h3>
            <p>Experience live markets risk-free.</p>
          </div>

          <div className="feature-card">
            <h3>Learn Risk-Free</h3>
            <p>Understand entries, exits and psychology.</p>
          </div>

          <div className="feature-card">
            <h3>Build Confidence</h3>
            <p>Develop strategies at your pace.</p>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}

export default Home;
