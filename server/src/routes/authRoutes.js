

import express from "express";
import { login } from "../controllers/authController.js";

const router = express.Router();

console.log("AUTH ROUTES LOADED");


router.post("/login", login);

router.post("/debug-create-user", async (req, res) => {
  console.log("DEBUG CREATE USER HIT");

  const { email, password, role } = req.body;
  const bcrypt = (await import("bcryptjs")).default;
  const User = (await import("../models/User.js")).default;

  const hashed = await bcrypt.hash(password, 10);

  const user = await User.create({
    email,
    password: hashed,
    role,
    isActive: true,
  });

  res.json({ message: "User created", email });
});


export default router;

