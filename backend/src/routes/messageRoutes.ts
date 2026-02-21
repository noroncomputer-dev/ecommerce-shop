import express from "express";
import {
  sendMessage,
  getUserMessages,
  getUnreadUserMessages,
  getAllMessages,
  getMessageById,
  updateMessageStatus,
  replyToMessage, // برای همه پیام‌های کاربر
  markMessageAsReadByUser, // برای پیام‌های نخونده
  deleteMessage,
} from "../controllers/messageController";
import { protect, admin } from "../middleware/authMiddleware";

const router = express.Router();

// =============== مسیرهای عمومی ===============
router.post("/", sendMessage);

// =============== مسیرهای محافظت شده کاربر ===============
router.get("/user/all", protect, getUserMessages); // همه پیام‌های کاربر
router.get("/user/unread", protect, getUnreadUserMessages); // فقط خوانده نشده
router.patch("/user/:id/read", protect, markMessageAsReadByUser);

// =============== مسیرهای محافظت شده (فقط ادمین) ===============
router.get("/", protect, admin, getAllMessages);
router.get("/:id", protect, admin, getMessageById);
router.patch("/:id/status", protect, admin, updateMessageStatus);
router.post("/:id/reply", protect, admin, replyToMessage);
router.delete("/:id", protect, admin, deleteMessage);

export default router;
