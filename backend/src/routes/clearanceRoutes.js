import express from "express";
import {
  createClearance,
  getMyClearances,
  getMyActiveClearance,
  getClearanceById,
  cancelClearance,
} from "../controllers/clearanceController.js";
import { protect } from "../middleware/auth.js";
import { upload } from "../middleware/upload.js";

const router = express.Router();

router.use(protect);

router.post("/", upload.array("documents", 5), createClearance);
router.get("/my", getMyClearances);
router.get("/my/active", getMyActiveClearance);
router.get("/:id", getClearanceById);
router.put("/:id/cancel", cancelClearance);

export default router;
