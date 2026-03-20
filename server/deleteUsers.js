import mongoose from "mongoose";
import dotenv from "dotenv";
import UserModel from "./models/user.model.js";

dotenv.config();

const deleteAllUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    console.log("✅ DB Connected");

    // Delete all users
    const result = await UserModel.deleteMany({});

    console.log(`✅ Deleted ${result.deletedCount} users from database`);

    process.exit();
  } catch (error) {
    console.log("❌ Error:", error.message);
    process.exit(1);
  }
};

deleteAllUsers();
