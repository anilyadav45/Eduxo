import express from "express";
import { protect } from "../middleware/auth.js";
import { allowRoles } from "../middleware/role.js";
import {
  createTimetable,
  getTeacherToday,
  getStudentToday,
} from "../controllers/timetableController.js";

const router = express.Router();

// Admin creates timetable
router.post(
  "/create",
  protect,
  allowRoles("COLLEGE_ADMIN"),
  createTimetable
);

// Teacher today schedule
router.get(
  "/teacher/today",
  protect,
  allowRoles("TEACHER"),
  getTeacherToday
);

// Student today routine
router.get(
  "/student/today",
  protect,
  allowRoles("STUDENT"),
  getStudentToday
);

export default router;
