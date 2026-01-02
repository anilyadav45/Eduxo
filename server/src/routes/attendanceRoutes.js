import express from "express";
import { protect } from "../middleware/auth.js";
import { allowRoles } from "../middleware/role.js";
import {
  markAttendance,
  getMyAttendance,
} from "../controllers/attendanceController.js";

const router = express.Router();

// Teacher marks attendance
router.post(
  "/mark",
  protect,
  allowRoles("TEACHER"),
  markAttendance
);

// Student views attendance
router.get(
  "/my",
  protect,
  allowRoles("STUDENT"),
  getMyAttendance
);


import { getAttendanceStats } from "../controllers/attendanceController.js";

router.get(
  "/stats",
  protect,
  allowRoles("STUDENT"),
  getAttendanceStats
);


export default router;
