import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import User from "../src/models/User.js";

dotenv.config({ path: "../.env" });

const bootstrap = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");

    const existing = await User.findOne({ role: "SUPER_ADMIN" });
    if (existing) {
      console.log("SUPER_ADMIN already exists");
      process.exit(0);
    }

    const hashed = await bcrypt.hash("superadmin123", 10);

    const admin = await User.create({
      name: "EduXo Super Admin",
      email: "superadmin@eduxo.com",
      password: hashed,
      role: "SUPER_ADMIN",
      isActive: true,
    });

    console.log("✅ SUPER_ADMIN created:");
    console.log("Email: superadmin@eduxo.com");
    console.log("Password: superadmin123");

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

bootstrap();
