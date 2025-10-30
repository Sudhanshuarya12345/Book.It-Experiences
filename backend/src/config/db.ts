import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const connectDB = async (): Promise<void> => {
    const uri = process.env.MONGO_URI;

    if(!uri){
        console.error("MONGO_URI is not defined in .env")
        process.exit();
    }
    
    try{
        await mongoose.connect(uri as string);
        console.log("MongoDB Connected")
    }
    catch(error){
        console.error("Database connection failed:", error);
        process.exit(1);
    }
};

export default connectDB;