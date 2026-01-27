import mongoose from "mongoose";

const FuturesPositionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  pair: { type: String, required: true },
  side: { type: String, enum: ["BUY", "SELL"], required: true },
  leverage: { type: Number, required: true },
  entryPrice: { type: Number, required: true },
  quantity: { type: Number, required: true },
  positionSize: { type: Number, required: true },
  marginUsed: { type: Number, required: true },
  liquidationPrice: { type: Number, required: true },
}, { timestamps: true });

export default mongoose.model("FuturesPosition", FuturesPositionSchema);