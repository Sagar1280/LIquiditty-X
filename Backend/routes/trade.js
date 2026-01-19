import express from "express";
import Wallet from "../models/Wallet.js";
import auth from "../middleware/requireAuth.js";

const router = express.Router();

router.post("/spot", auth, async (req, res) => {
  const { side, baseCoin, amount, price } = req.body;
  const userId = req.user.id;

  const wallet = await Wallet.findOne({ user: userId });
  if (!wallet) return res.status(404).json({msg : " no wallet found"});

  const balances = wallet.balances;

  if (side === "BUY") {
    if ((balances.get("USDT") || 0) < amount)
      return res.status(400).json({ message: "Insufficient USDT" });

    balances.set("USDT", balances.get("USDT") - amount);
    balances.set(
      baseCoin,
      (balances.get(baseCoin) || 0) + amount / price
    );
  }

  if (side === "SELL") {
    if ((balances.get(baseCoin) || 0) < amount)
      return res.status(400).json({ message: "Insufficient asset" });

    balances.set(baseCoin, balances.get(baseCoin) - amount);
    balances.set("USDT", (balances.get("USDT") || 0) + amount * price);
  }

  wallet.markModified("balances");
  await wallet.save();

  res.json(Object.fromEntries(wallet.balances));
});

export default router;
