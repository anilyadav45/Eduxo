import express from "express";
import { protect } from "../middleware/auth.js";
import { allowRoles } from "../middleware/role.js";
import {
  createExam,
  enterMarks,
  getStudentResults,
} from "../controllers/examController.js";

const router = express.Router();

// Admin creates exam
router.post(
  "/create",
  protect,
  allowRoles("COLLEGE_ADMIN"),
  createExam
);

// Teacher/Admin enters marks
router.post(
  "/marks",
  protect,
  allowRoles("COLLEGE_ADMIN", "TEACHER"),
  enterMarks
);

// Student views results
router.get(
  "/my-results",
  protect,
  allowRoles("STUDENT"),
  getStudentResults
);

export default router;
