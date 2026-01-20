import express from "express";
import Wallet from "../models/Wallet.js";
import authMiddleware from "../middleware/requireAuth.js";

const router = express.Router();

router.get("/", authMiddleware, async (req, res) => {
  try {
    const wallet = await Wallet.findOne({ user: req.user.id });

    if (!wallet) {
      return res.status(404).json({ msg: "Wallet not found" });
    }

    // 🔥 Convert Mongo Maps → plain objects
    const spot = Object.fromEntries(wallet.wallets.spot || []);
    const futures = Object.fromEntries(wallet.wallets.futures || []);

    return res.json({
      spot,
      futures,
    });

  } catch (err) {
    console.error("GET /wallet error:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

router.post("/deposit", authMiddleware, async (req, res) => {
  const { asset, amount } = req.body;

  if (!asset || !amount || amount <= 0) {
    return res.status(400).json({ msg: "Invalid deposit data" });
  }

  try {
    const wallet = await Wallet.findOne({ user: req.user.id });

    if (!wallet) {
      return res.status(404).json({ msg: "Wallet not found" });
    }

    // 🔥 Dynamic asset handling (Map-safe)
    const currentBalance = wallet.wallets.spot.get(asset) || 0;
    wallet.wallets.spot.set(asset, currentBalance + Number(amount));

    await wallet.save();

    return res.json({
      msg: "Deposit successful",
      spot: Object.fromEntries(wallet.wallets.spot),
    });

  } catch (err) {
    console.error("POST /wallet/deposit error:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

router.post("/transfer", authMiddleware, async (req, res) => {
  const { from, to, asset, amount } = req.body;

  // Basic validation
  if (
    !from ||
    !to ||
    !asset ||
    !amount ||
    amount <= 0 ||
    from === to
  ) {
    return res.status(400).json({ msg: "Invalid transfer data" });
  }

  // Only allow spot <-> futures
  const allowed = ["spot", "futures"];
  if (!allowed.includes(from) || !allowed.includes(to)) {
    return res.status(400).json({ msg: "Invalid wallet type" });
  }

  try {
    const wallet = await Wallet.findOne({ user: req.user.id });

    if (!wallet) {
      return res.status(404).json({ msg: "Wallet not found" });
    }

    const fromWallet = wallet.wallets[from];
    const toWallet = wallet.wallets[to];

    const fromBalance = fromWallet.get(asset) || 0;

    if (fromBalance < amount) {
      return res.status(400).json({ msg: "Insufficient balance" });
    }

    // 🔥 Perform transfer (Map-safe)
    fromWallet.set(asset, fromBalance - Number(amount));

    const toBalance = toWallet.get(asset) || 0;
    toWallet.set(asset, toBalance + Number(amount));

    await wallet.save();

    return res.json({
      msg: "Transfer successful",
      spot: Object.fromEntries(wallet.wallets.spot),
      futures: Object.fromEntries(wallet.wallets.futures),
    });

  } catch (err) {
    console.error("POST /wallet/transfer error:", err);
    res.status(500).json({ msg: "Server error" });
  }
});




export default router;
