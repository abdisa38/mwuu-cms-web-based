import express from "express";
import {
  getOfficerDashboard,
  getDepartmentQueue,
  reviewClearance,
  getStudentDirectory,
} from "../controllers/officerController.js";
import { protect } from "../middleware/auth.js";
import { authorize } from "../middleware/roleCheck.js";

const router = express.Router();

router.use(protect);
router.use(authorize("officer", "registrar", "admin"));

router.get("/dashboard", getOfficerDashboard);
router.get("/queue", getDepartmentQueue);
router.put("/clearances/:id/review", reviewClearance);
router.get("/students", getStudentDirectory);

export default router;
