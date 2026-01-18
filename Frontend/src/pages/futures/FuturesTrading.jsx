import React from 'react'
import Navbar from '../../components/Navbar'
import Sidebar from '../../components/Sidebar'
import { futuresPairs } from '../../data/cryptoPrices'
import TradingViewWidget from '../../components/TradingViewWidget'
import TransactionBar from '../../components/TransactionBar'

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

        <TransactionBar mode="futures" />


      </div>

    </div>
    </>
  )
}

export default FuturesTrading