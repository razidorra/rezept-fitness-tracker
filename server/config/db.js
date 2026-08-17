import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB verbunden");
  } catch (err) {
    console.error("MongoDB Verbindungsfehler:", err.message);
    process.exit(1);
  }
};

export default connectDB;
