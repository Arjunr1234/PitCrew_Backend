import mongoose from 'mongoose';
import dotenv from 'dotenv'; 
 
dotenv.config(); 

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
    throw new Error('MONGO_URI is not defined in environment variables');
}

const connectDB = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('MongoDB connected successfully');
    } catch (err) {
        console.error('MongoDB connection failed', err);
        process.exit(1);
    }
};


export default connectDB;
