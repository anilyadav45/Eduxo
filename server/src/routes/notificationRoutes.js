import express from "express";
import { protect } from "../middleware/auth.js";
import { allowRoles } from "../middleware/role.js";
import {
  createNotification,
  getMyNotifications,
  markAsRead,
} from "../controllers/notificationController.js";

const router = express.Router();

// Admin announcement
router.post(
  "/create",
  protect,
  allowRoles("COLLEGE_ADMIN"),
  createNotification
);

// User notifications
router.get(
  "/my",
  protect,
  allowRoles("STUDENT", "TEACHER"),
  getMyNotifications
);

// Mark read
router.patch(
  "/read/:id",
  protect,
  allowRoles("STUDENT", "TEACHER"),
  markAsRead
);

export default router;
