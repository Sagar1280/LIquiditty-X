function Hero() {
  return (
    <section className="hero">
      <div className="hero-text">
        <h2>
          The only way to ace trading
          <br />
          is to practice trading.
        </h2>

        <p>
          That’s why we built <span>Liquidity-X</span> — a powerful demo trading
          platform where you can learn, experiment and grow without risking your
          real money.
        </p>
      </div>

      <div className="stats-card">
        <div className="stats-header">Popular</div>

        <div className="stat-row">
          <span>Bitcoin</span>
          <span className="neg">-1.52%</span>
        </div>
        <div className="stat-row">
          <span>Ethereum</span>
          <span className="pos">+0.18%</span>
        </div>
        <div className="stat-row">
          <span>BNB</span>
          <span className="pos">+0.27%</span>
        </div>
        <div className="stat-row">
          <span>SOL</span>
          <span className="neg">-0.59%</span>
        </div>
        <div className="stat-row">
          <span>ADA</span>
          <span className="pos">+1.20%</span>
        </div>
        <div className="stat-row">
          <span>SPX</span>
          <span className="pos">+10.47%</span>
        </div>
      </div>
    </section>
  );
}

export default Hero;
