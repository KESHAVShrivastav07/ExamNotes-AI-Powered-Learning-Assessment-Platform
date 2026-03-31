import mongoose from "mongoose";
import dotenv from "dotenv";
import Admin from "../models/admin.model.js";

dotenv.config();

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    console.log("✅ DB Connected for seeding");

    // check if admin already exists
    const existingAdmin = await Admin.findOne({
      email: "admin@gmail.com",
    });

    if (existingAdmin) {
      console.log("⚠️ Admin already exists");
      process.exit();
    }

    // create admin
    const admin = await Admin.create({
      name: "Keshav Admin",
      email: "admin@gmail.com",
      password: "123456", // auto hashed by model
    });

    console.log("✅ Admin created:", admin.email);

    process.exit();
  } catch (error) {
    console.log("❌ Seeder Error:", error.message);
    process.exit(1);
  }
};

seedAdmin();
