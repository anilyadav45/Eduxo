import express from "express";
import { protect } from "../middleware/auth.js";
import { allowRoles } from "../middleware/role.js";
import { getAttendance, getNotes } from "../controllers/studentController.js";

const router = express.Router();
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

import { getTodayRoutine } from "../controllers/studentController.js";

router.get(
  "/today",
  protect,
  allowRoles("STUDENT"),
  getTodayRoutine
);

export default router;