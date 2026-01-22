import express from "express";
import { protect } from "../middleware/auth.js";
import { allowRoles } from "../middleware/role.js";
import { createUserByAdmin } from "../controllers/userController.js";

const router = express.Router();

router.post(
  "/create",
  protect,
  allowRoles("SUPER_ADMIN", "COLLEGE_ADMIN"),
  createUserByAdmin
);

export default router;
