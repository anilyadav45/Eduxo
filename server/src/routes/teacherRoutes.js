import express from "express";
import { protect } from "../middleware/auth.js";
import { allowRoles } from "../middleware/role.js";
import {
  assignTeacher,
  getTodayClasses,
  getTeacherDashboard,
  getSubjectReport
} from "../controllers/teacherController.js";

const router = express.Router();

// Teacher dashboard
router.get(
  "/dashboard",
  protect,
  allowRoles("TEACHER"),
  getTeacherDashboard
);

// Assign teacher to subject (College Admin)
router.post(
  "/assign-subject",
  protect,
  allowRoles("COLLEGE_ADMIN"),
  assignTeacher
);

// Teacher: today’s classes
router.get(
  "/today",
  protect,
  allowRoles("TEACHER"),
  getTodayClasses
);

// Subject attendance report
router.get(
  "/subject-report/:subjectId",
  protect,
  allowRoles("TEACHER"),
  getSubjectReport
);

export default router;
