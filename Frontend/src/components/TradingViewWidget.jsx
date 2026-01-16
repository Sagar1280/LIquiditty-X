import { useEffect, useRef } from "react";
import { useMarketStore } from "../store/marketStore";
import { useLocation } from "react-router-dom";

const TradingViewWidget = () => {


  const containerRef = useRef(null);

  const location = useLocation();

  const selectedPair = useMarketStore((s) => s.selectedPair);

  const isFutures = location.pathname.startsWith("/futures");


  useEffect(() => {

    if (!containerRef.current) return;

    containerRef.current.innerHTML = "";

    const script = document.createElement("script");
    script.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.async = true;

    // TradingView configuration
    script.innerHTML = JSON.stringify({
      autosize: true,
      symbol: isFutures ? `BINANCE:${selectedPair}.P` : `BINANCE:${selectedPair}`,
      interval: "15",
      timezone: "Etc/UTC",
      theme: "dark",
      style: "1",
      locale: "en",
      allow_symbol_change: false,
    });

   
    containerRef.current.appendChild(script);

  }, [selectedPair]);

  return (
    <div
      className="tradingview-widget-container"
      ref={containerRef}
      style={{ height: "100%", width: "100%" }}
    />
  );
};

export default TradingViewWidget;
