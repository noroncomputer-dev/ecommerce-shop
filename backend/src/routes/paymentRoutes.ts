import express from "express";
import {
  initiatePayment,
  verifyPaymentCallback,
} from "../controllers/paymentController";
import { protect } from "../middleware/authMiddleware";

const router = express.Router();

// POST /api/payment/request — شروع پرداخت (نیاز به لاگین)
router.post("/request", protect, initiatePayment);

// GET /api/payment/verify — callback زرین‌پال (بدون لاگین چون redirect هست)
router.get("/verify", verifyPaymentCallback);

export default router;
