import React from 'react'
import Navbar from '../../components/Navbar'

const ConvertCrypto = () => {
  return (
    <>
      <div className="xyz">
        hi hi ih
      </div>
      <div className="convert">
        <div className="convert-panel">

          <div className="convert-tabs">
            <button className="active">Instant</button>
            <button>Limit</button>
          </div>

          <div className="convert-section">
            <div className="convert-section-header">
              <span>From</span>
              <span className="balance">Balance: -- USDT</span>
            </div>
            <div className="convert-section-body">
              <span className="asset">USDT</span>
              <span className="amount">1234 <span className="max-btn">MAX</span></span>
            </div>
          </div>

          <div className="convert-swap">
            ↓
          </div>

          <div className="convert-section">
            <div className="convert-section-header">
              <span>To</span>
              <span className="balance">Balance: -- BTC</span>
            </div>
            <div className="convert-section-body">
              <span className="asset">BTC</span>
              <span className="amount">0.000</span>
            </div>
          </div>
          

          <button className="convert-btn">Convert</button>

        </div>
      </div>

    </>
  )
}

export default ConvertCrypto