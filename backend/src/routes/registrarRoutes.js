import express from "express";
import {
  getRegistrarDashboardStats,
  getAllClearances,
  finalApproveClearance,
  rejectClearance,
  getCertificates,
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  getStaffDepartments,
  createDepartment,
  updateDepartment,
  deleteDepartment,
  getWorkflows,
  saveWorkflow,
  getAuditLogs,
} from "../controllers/registrarController.js";
import { protect } from "../middleware/auth.js";
import { authorize } from "../middleware/roleCheck.js";

const router = express.Router();

router.use(protect);
router.use(authorize("registrar", "admin"));

// Dashboard & Clearances
router.get("/dashboard", getRegistrarDashboardStats);
router.get("/clearances", getAllClearances);
router.put("/clearances/:id/final-approve", finalApproveClearance);
router.put("/clearances/:id/reject", rejectClearance);
router.get("/certificates", getCertificates);

// User Management
router.get("/users", getUsers);
router.post("/users", createUser);
router.put("/users/:id", updateUser);
router.delete("/users/:id", deleteUser);

// Department Management
router.get("/departments", getStaffDepartments);
router.post("/departments", createDepartment);
router.put("/departments/:id", updateDepartment);
router.delete("/departments/:id", deleteDepartment);

// Workflow Management
router.get("/workflows", getWorkflows);
router.post("/workflows", saveWorkflow);

// Audit Logs
router.get("/audit-logs", getAuditLogs);

export default router;
