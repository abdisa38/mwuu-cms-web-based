import express from "express";
import { getMyMessages, getConversations, sendMessage } from "../controllers/messageController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.use(protect);

router.get("/", getMyMessages);
router.get("/conversations", getConversations);
router.post("/", sendMessage);

export default router;
