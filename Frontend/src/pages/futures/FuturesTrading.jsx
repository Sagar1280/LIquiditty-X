import React from 'react'
import Navbar from '../../components/Navbar'
import Sidebar from '../../components/Sidebar'
import { futuresPairs } from '../../data/cryptoPrices'
import TradingViewWidget from '../../components/TradingViewWidget'

const FuturesTrading = () => {
  return (
    <>
      <div className="tradespot">

      <Sidebar data={futuresPairs} />

      {/* MAIN PANEL */}
      <div className="main">

        <div className="chart">
          <TradingViewWidget />
        </div>

        <div className="TransactionSpotBar"></div>

      </div>

    </div>
    </>
  )
}

export default FuturesTrading