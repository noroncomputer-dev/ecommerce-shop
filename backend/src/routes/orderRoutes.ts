import express from "express";
import {
  createOrder,
  getUserOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
} from "../controllers/orderController";
import { protect, admin } from "../middleware/authMiddleware";

const router = express.Router();

router.post("/", protect, createOrder);
router.get("/my-orders", protect, getUserOrders);
router.get("/all", protect, admin, getAllOrders);

// ✅ این route باید قبل از /:id باشه — وگرنه "success" به عنوان ID گرفته میشه
router.get("/success", (req, res) => {
  res.json({ message: "ok" });
});

router.get("/:id", protect, getOrderById);
router.put("/:id/status", protect, admin, updateOrderStatus);

export default router;
