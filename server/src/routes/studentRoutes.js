import express from "express";
import { protect } from "../middleware/auth.js";
import { allowRoles } from "../middleware/role.js";
import { getAttendance, getNotes,getStudentDashboard } from "../controllers/studentController.js";
import { getTodayRoutine } from "../controllers/studentController.js";

const router = express.Router();

//get dashboard

router.get(
  "/dashboard",
  protect,
  allowRoles("STUDENT"),
  getStudentDashboard
);

//get attendence
router.get(
  "/attendance",
  protect,
  allowRoles("STUDENT"),
  getAttendance
);
//get notes
router.get(
  "/notes",
  protect,
  allowRoles("STUDENT"),
  getNotes
);

//get attendence


router.get(
  "/today",
  protect,
  allowRoles("STUDENT"),
  getTodayRoutine
);

export default router;