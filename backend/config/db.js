import mongoose from 'mongoose';

export const connectDB = async () => {
  const connUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/tpre_commissioning_db';
  try {
    const conn = await mongoose.connect(connUri, {
      serverSelectionTimeoutMS: 4000 // 4 seconds timeout for fast fallback if local mongo is offline
    });
    console.log(`🍃 MongoDB Connected: ${conn.connection.host} / Database: ${conn.connection.name}`);
    return true;
  } catch (error) {
    console.warn(`⚠️ MongoDB connection warning (${error.message}). Operating in Local JSON Fallback Mode.`);
    return false;
  }
};
