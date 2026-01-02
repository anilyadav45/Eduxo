import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import User from "../src/models/User.js";

console.log("🚀 Bootstrap script started");

dotenv.config({ path: "../.env" });

console.log("ENV MONGO_URI:", process.env.MONGO_URI ? "FOUND" : "MISSING");

async function bootstrap() {
  try {
    console.log("🔌 Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected");

    const email = "admin@eduxo.com";

    console.log("🔍 Checking existing admin...");
    const exists = await User.findOne({ email });

    if (exists) {
      console.log("ℹ️ Admin already exists:", exists.email);
      process.exit(0);
    }

    console.log("🔐 Hashing password...");
    const hashedPassword = await bcrypt.hash("admin123", 10);

    console.log("👤 Creating admin user...");
    const admin = await User.create({
      name: "EduXo System Admin",
      email,
      password: hashedPassword,
      role: "COLLEGE_ADMIN",
      isActive: true,
    });

    console.log("🎉 Admin created successfully:", admin.email);
    process.exit(0);
  } catch (err) {
    console.error("❌ Bootstrap failed:", err);
    process.exit(1);
  }
}

bootstrap();
