import mongoose from "mongoose";

const connectDB = async (): Promise<void> => {
    try {
        const URL = process.env.DATABASE_URL;
        
        if (!URL) {
            throw new Error("Database URL is not defined");
        }

        await mongoose.connect(URL);
        console.log("MongoDB is connected successfully");
    } catch (error) {
        console.error("MongoDB connection error:", error);
        process.exit(1);
    }
};

export default connectDB; 