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

        <div className="TransactionBar">
          <div className="futures-tx-order-type">
            <div className="tx-order-type">
            <button className="tx-type active">Market</button>
            <button className="tx-type">Limit</button>
            <button className="tx-type">Stop Limit</button>
            </div>
            <div>
              <button className="leverage-type"> Cross </button>
              <button className="leverage-btn"> 20x</button>
            </div>
          </div>

          <div className="tx-input">
            <input type="text" placeholder="Price" />
            <div className="tx-input-suffix">Market Price</div>
          </div>

          <div className="tx-input">
            <input type="text" placeholder="Amount" />
            <div className="tx-input-suffix">USDT</div>
          </div>

          <div className="tx-balance">Available: -- USDT</div>

          <div className="tx-actions">
            <button className="tx-btn-buy">Long</button>
            <button className="tx-btn-sell">Short</button>
          </div>
 
          
        </div>

      </div>

    </div>
    </>
  )
}

export default FuturesTrading