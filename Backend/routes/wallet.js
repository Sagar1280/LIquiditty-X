import express from "express";
import Wallet from "../models/Wallet.js";
import requireAuth from "../middleware/requireAuth.js";

const router = express.Router();

router.get("/", requireAuth, async (req, res) => {
  const wallet = await Wallet.findOne({ user: req.user.id });
  if (!wallet) return res.json({ balances: {} });

  res.json({
    balances: Object.fromEntries(wallet.balances),
  });
});

export default router;
