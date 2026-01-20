import express from "express";
import Wallet from "../models/Wallet.js";
import authMiddleware from "../middleware/requireAuth.js";

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

export default router;
