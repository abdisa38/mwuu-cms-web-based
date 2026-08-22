import express from "express";
import {
  verifyCertificate,
  getCollegesAndDepartments,
  getFaqs,
  getPublicStats,
} from "../controllers/publicController.js";

const router = express.Router();

router.get("/stats", getPublicStats);
router.get("/colleges-departments", getCollegesAndDepartments);
router.get("/faqs", getFaqs);
router.get("/verify/:query", verifyCertificate);

export default router;
