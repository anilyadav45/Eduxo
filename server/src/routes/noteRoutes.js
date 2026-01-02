import express from "express";
import { protect } from "../middleware/auth.js";
import { allowRoles } from "../middleware/role.js";
import upload from "../config/multer.js";
import {
  uploadNote,
  getNotes,
} from "../controllers/noteController.js";

const router = express.Router();

// Teacher uploads notes
router.post(
  "/upload",
  protect,
  allowRoles("TEACHER"),
  upload.single("file"),
  uploadNote
);

// Student views notes
router.get(
  "/",
  protect,
  allowRoles("STUDENT"),
  getNotes
);

export default router;
