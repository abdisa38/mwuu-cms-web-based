import express from "express";
import {
  verifyCertificate,
  getCollegesAndDepartments,
  getFaqs,
} from "../controllers/publicController.js";

const router = express.Router();

router.get("/colleges-departments", getCollegesAndDepartments);
router.get("/faqs", getFaqs);
router.get("/verify/:query", verifyCertificate);

export default router;
