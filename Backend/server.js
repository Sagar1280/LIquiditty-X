import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
const app= express();

app.use(cors());
app.use(express.json());

app.get('/',(req,res)=>{
    res.send("backend working !!");
})

mongoose.connect(process.env.MONGO_URI)
.then(()=>console.log("Mongo DataBase Connected !!!"))
.catch((err)=> console.log(err));

app.listen(5000, ()=> console.log("server started and running on port 5000"));