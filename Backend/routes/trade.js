import express from "express";
import Wallet from "../models/Wallet.js";
import authMiddleware from "../middleware/requireAuth.js";
import FuturesPosition from "../models/FuturesPosition.js";

const router = express.Router();

router.post("/spot", authMiddleware, async (req, res) => {
  const { side, baseCoin, amount, price } = req.body;

  if (!side || !baseCoin || !amount || !price || amount <= 0 || price <= 0) {
    return res.status(400).json({ msg: "Invalid trade data" });
  }

  try {
    const wallet = await Wallet.findOne({ user: req.user.id });

    if (!wallet) {
      return res.status(404).json({ msg: "Wallet not found" });
    }

    const spot = wallet.wallets.spot;

    const usdtBal = spot.get("USDT") || 0;
    const baseBal = spot.get(baseCoin) || 0;

    if (side === "BUY") {
      // amount = USDT spent
      if (usdtBal < amount) {
        return res.status(400).json({ msg: "Insufficient USDT balance" });
      }

      const qty = amount / price;

      spot.set("USDT", usdtBal - amount);
      spot.set(baseCoin, baseBal + qty);

    } else if (side === "SELL") {
      // amount = baseCoin sold
      if (baseBal < amount) {
        return res.status(400).json({ msg: `Insufficient ${baseCoin} balance` });
      }

      const usdtReceived = amount * price;

      spot.set(baseCoin, baseBal - amount);
      spot.set("USDT", usdtBal + usdtReceived);

    } else {
      return res.status(400).json({ msg: "Invalid trade side" });
    }

    await wallet.save();

    return res.json({
      msg: "Spot trade executed",
      spot: Object.fromEntries(wallet.wallets.spot),
    });

  } catch (err) {
    console.error("POST /trade/spot error:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

router.post("/futures", authMiddleware, async (req, res) => {
  const { side, pair, leverage, entryPrice, usdtAmount } = req.body;


  if (!side || !pair || !leverage || !entryPrice || !usdtAmount) {
    return res.status(400).json({ msg: "Invalid futures trade data" });
  }


  try {
    const wallet = await Wallet.findOne({ user: req.user.id });
    if (!wallet) return res.status(404).json({ msg: "Wallet not found" });


    const futuresWallet = wallet.wallets.futures;


    const usdtBalance = futuresWallet.get("USDT") || 0;


    const takerFeeRate = 0.0004;
    const openFee = usdtAmount * takerFeeRate;
    const marginRequired = usdtAmount / leverage;


    if (usdtBalance < marginRequired + openFee) {
      return res.status(400).json({ msg: "Insufficient futures balance" });
    }


    const quantity = usdtAmount / entryPrice;


    const maintenanceMarginRate = 0.005;


    let liquidationPrice;


    if (side === "BUY") {
      liquidationPrice =
        entryPrice *
        (1 - 1 / leverage + maintenanceMarginRate);
    } else {
      liquidationPrice =
        entryPrice *
        (1 + 1 / leverage - maintenanceMarginRate);
    }


    futuresWallet.set(
      "USDT",
      usdtBalance - marginRequired - openFee
    );


    await wallet.save();


    const position = await FuturesPosition.create({
      user: req.user.id,
      pair,
      side,
      leverage,
      entryPrice,
      quantity,
      positionSize: usdtAmount,
      marginUsed: marginRequired,
      liquidationPrice,
    });


    return res.json({
      msg: "Futures position opened",
      position,
      futures: Object.fromEntries(wallet.wallets.futures),
    });


  } catch (err) {
    console.error("POST /trade/futures error:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

router.post("/futures/close", authMiddleware, async (req, res) => {
  const { positionId, currentPrice } = req.body;

  if (!positionId || !currentPrice) {
    return res.status(400).json({ msg: "Invalid close data" });
  }

  try {
    const position = await FuturesPosition.findById(positionId);
    if (!position) {
      return res.status(404).json({ msg: "Position not found" });
    }

    const wallet = await Wallet.findOne({ user: req.user.id });
    if (!wallet) {
      return res.status(404).json({ msg: "Wallet not found" });
    }

    const futuresWallet = wallet.wallets.futures;
    const currentBal = futuresWallet.get("USDT") || 0;

    let pnl = 0;

    if (position.side === "BUY") {
      pnl =
        (currentPrice - position.entryPrice) *
        position.quantity;
    } else {
      pnl =
        (position.entryPrice - currentPrice) *
        position.quantity;
    }

    const takerFeeRate = 0.0004;
    const closeFee = position.positionSize * takerFeeRate;

    const net = pnl - closeFee;

    // ADD BACK margin + pnl
    futuresWallet.set(
      "USDT",
      currentBal + position.marginUsed + net
    );

    await wallet.save();
    await position.deleteOne();

    return res.json({
      msg: "Position closed",
      futures: Object.fromEntries(wallet.wallets.futures),
    });

  } catch (err) {
    console.error("Close futures error:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

router.get("/futures", authMiddleware, async (req, res) => {
  const positions = await FuturesPosition.find({ user: req.user.id });
  res.json({ positions });
});

export default router;
