import { Response } from "express";
import { AuthRequest } from "../middleware/authMiddleware";
import Order from "../models/Order";
import { requestPayment, verifyPayment } from "../services/zarinpalService";

// ─── درخواست پرداخت ───
export const initiatePayment = async (req: AuthRequest, res: Response) => {
  try {
    const { orderId } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "سفارش یافت نشد" });
    }

    // چک کردن اینکه سفارش متعلق به کاربر جاری باشه
    if (order.user.toString() !== req.user?._id.toString()) {
      return res.status(403).json({ message: "دسترسی غیرمجاز" });
    }

    // چک کردن اینکه قبلاً پرداخت نشده باشه
    if (order.paymentStatus === "paid") {
      return res.status(400).json({ message: "این سفارش قبلاً پرداخت شده" });
    }

    const { authority, paymentUrl } = await requestPayment(
      order.totalAmount,
      `پرداخت سفارش ${order._id}`,
      order._id.toString(),
    );

    // ذخیره authority در سفارش
    await Order.findByIdAndUpdate(orderId, { authority });

    res.json({ paymentUrl });
  } catch (error: any) {
    console.error("❌ Payment initiation error:", error);
    res.status(500).json({ message: error.message });
  }
};

// ─── تایید پرداخت ───
export const verifyPaymentCallback = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const { Authority, Status, orderId } = req.query as {
      Authority: string;
      Status: string;
      orderId: string;
    };

    // اگه کاربر پرداخت رو لغو کرد
    if (Status === "NOK") {
      return res.redirect(
        `${process.env.FRONTEND_URL || "http://localhost:3000"}/payment/failed?orderId=${orderId}`,
      );
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.redirect(
        `${process.env.FRONTEND_URL || "http://localhost:3000"}/payment/failed`,
      );
    }

    // verify کردن پرداخت
    const { refId } = await verifyPayment(Authority, order.totalAmount);

    // آپدیت سفارش
    await Order.findByIdAndUpdate(orderId, {
      paymentStatus: "paid",
      status: "confirmed",
      "payment.transactionId": refId.toString(),
      "payment.paidAt": new Date(),
    });

    // redirect به صفحه موفقیت
    res.redirect(
      `${process.env.FRONTEND_URL || "http://localhost:3000"}/payment/success?orderId=${orderId}&refId=${refId}`,
    );
  } catch (error: any) {
    console.error("❌ Payment verification error:", error);
    res.redirect(
      `${process.env.FRONTEND_URL || "http://localhost:3000"}/payment/failed`,
    );
  }
};
