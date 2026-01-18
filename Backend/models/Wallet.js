import mongoose from "mongoose";

const WalletSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, // one spot wallet per user
    },

    // Dynamic balances map

    balances: {
      type: Map,
      of: Number,
      default: () => ({
        
       }),
    },
  },
  { timestamps: true }
);

export default mongoose.model("Wallet", WalletSchema);
