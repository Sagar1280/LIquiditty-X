function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-grid">
        <div className="footer-brand">
          <h2 className="footer-logo">
            LIQUIDITY<span>-X</span>
          </h2>
        </div>

        {[
          ["About", ["About Liquidity-X", "Press", "Community", "Careers"]],
          ["Services", ["Buy", "P2P", "Referral", "Institutional"]],
          ["Support", ["Help Center", "Fees", "API", "Feedback"]],
          ["Products", ["Spot", "Futures", "Earn", "Launchpad"]],
        ].map(([title, items]) => (
          <div className="footer-column" key={title}>
            <h4>{title}</h4>
            <ul>
              {items.map((i) => (
                <li key={i}>{i}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </footer>
  );
}

export default Footer;
