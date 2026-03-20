import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ DB Connected");
  } catch (error) {
    console.log("❌ DB Error:", error.message);
    process.exit(1);
  }
};

export default connectDB;
