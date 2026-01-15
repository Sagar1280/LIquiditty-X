import mongoose from "mongoose";

const connectDB = async () => {

    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("monogoDB connected !!!!");
    }catch(err){
        console.error("DB connection Failed",err);
        process.exit(1);
    }

}

export default connectDB;