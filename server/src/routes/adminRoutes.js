import express from "express";
import { protect } from "../middleware/auth.js";
import { allowRoles } from "../middleware/role.js";
import { assignStudentSemester,getSemesterReport } from "../controllers/adminController.js";
import { getAdminDashboardStats } from "../controllers/adminAnalyticsController.js";
import { requireSameCollege } from "../middleware/tenant.js";
import {
  createCollege,
  createDepartment,
  createSemester,
  createSubject
} from "../controllers/adminController.js";

const router = express.Router();

router.post("/college", protect, allowRoles("SUPER_ADMIN"), createCollege);

router.post("/department", protect, allowRoles("COLLEGE_ADMIN"), createDepartment);

router.post("/semester", protect, allowRoles("COLLEGE_ADMIN"), createSemester);

router.post("/subject", protect, allowRoles("COLLEGE_ADMIN"), createSubject);


router.post(
  "/assign-student-semester",
  protect,
  allowRoles("COLLEGE_ADMIN"),
  assignStudentSemester
);



router.get(
  "/dashboard-stats",
  protect,
  allowRoles("COLLEGE_ADMIN"),
  getAdminDashboardStats
);

router.post(
  "/department",
  protect,
  allowRoles("COLLEGE_ADMIN"),
  requireSameCollege,
  createDepartment
);

router.get(
  "/semester-report/:semesterId",
  protect,
  allowRoles("COLLEGE_ADMIN"),
  getSemesterReport
);


export default router;
