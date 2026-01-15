import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email:{ type : String , unique : true},
    password : String ,
    resfreshToken : String,
},
    {timestamps: true}
);

export default mongoose.model("User" , userSchema)