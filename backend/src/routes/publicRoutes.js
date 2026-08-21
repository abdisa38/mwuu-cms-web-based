import express from "express";
import { verifyCertificate } from "../controllers/publicController.js";

const router = express.Router();

router.get("/verify/:query", verifyCertificate);

export default router;
