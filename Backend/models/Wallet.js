import mongoose from "mongoose";

const WalletSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    wallets: {
      spot: {
        type: Map,
        of: Number,
        default: () => new Map(), // 🔥 fully dynamic
      },

      futures: {
        type: Map,
        of: Number,
        default: () => new Map(), // 🔥 fully dynamic
      },
    },
  },
  { timestamps: true }
);

export default mongoose.model("Wallet", WalletSchema);
``
