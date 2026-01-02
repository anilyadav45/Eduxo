import bcrypt from "bcryptjs";
import User from "../models/User.js";

export const createUserByAdmin = async (req, res) => {
  try {
    const { name, email, role } = req.body;

    if (!name || !email || !role) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (!["TEACHER", "STUDENT"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const defaultPassword = "password123";
    const hashedPassword = await bcrypt.hash(defaultPassword, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      isActive: true,
    });

    res.status(201).json({
      message: "User created successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      defaultPassword, // dev only
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
