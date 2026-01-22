import bcrypt from "bcryptjs";
import User from "../models/User.js";

export const createUserByAdmin = async (req, res) => {
  try {
    const { name, email, role, college } = req.body;

    if (!name || !email || !role) {
      return res.status(400).json({ message: "All fields are required" });
    }

    /**
     * ROLE PERMISSION MATRIX
     * SUPER_ADMIN  -> can create COLLEGE_ADMIN
     * COLLEGE_ADMIN -> can create TEACHER, STUDENT
     */

    let allowedRoles = [];

    if (req.user.role === "SUPER_ADMIN") {
      allowedRoles = ["COLLEGE_ADMIN"];
    }

    if (req.user.role === "COLLEGE_ADMIN") {
      allowedRoles = ["TEACHER", "STUDENT"];
    }

    if (!allowedRoles.includes(role)) {
      return res.status(403).json({ message: "Invalid role" });
    }

    /**
     * COLLEGE VALIDATION
     */
    if (role === "COLLEGE_ADMIN" && !college) {
      return res.status(400).json({
        message: "College is required for COLLEGE_ADMIN",
      });
    }

    if ((role === "TEACHER" || role === "STUDENT") && !college) {
      return res.status(400).json({
        message: "College is required for TEACHER and STUDENT",
      });
    }

    /**
     * DUPLICATE CHECK
     */
    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "User already exists" });
    }

    /**
     * PASSWORD SETUP
     */
    const defaultPassword = "password123";
    const hashedPassword = await bcrypt.hash(defaultPassword, 10);

    /**
     * CREATE USER
     */
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      college,
      isActive: true,
    });

    res.status(201).json({
      message: "User created successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        college: user.college,
      },
      defaultPassword, // dev only
    });
  } catch (err) {
    console.error("Create user error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
