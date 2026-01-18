import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.js";
import walletRoutes from "./routes/wallet.js";


dotenv.config();
const app = express();
connectDB();



app.use(cors({
    origin: "http://localhost:5173", // front end to backend connection ,,                        
    credentials: true                // credentials = true signifies allowed
}));

app.use(express.json());

app.use(cookieParser()); // need for refresh tokens

app.get('/', (req, res) => {
    res.send("backend working !!");
})

app.use("/auth" , authRoutes);
app.use("/wallet", walletRoutes);

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`server started and running on port ${PORT}`));