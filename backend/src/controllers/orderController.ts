import { Request, Response } from "express";
import Order from "../models/Order";
import Product from "../models/Product";
import { AuthRequest } from "../middleware/authMiddleware";

// ایجاد سفارش جدید
export const createOrder = async (req: AuthRequest, res: Response) => {
  try {
    const { items, shippingAddress, paymentMethod } = req.body;
    const userId = req.user?._id;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "سبد خرید خالی است" });
    }

    let totalAmount = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item.productId);

      if (!product) {
        return res
          .status(404)
          .json({ message: `محصول ${item.productId} یافت نشد` });
      }

      if (product.stock < item.quantity) {
        return res
          .status(400)
          .json({ message: `موجودی ${product.name} کافی نیست` });
      }

      totalAmount += product.price * item.quantity;

      orderItems.push({
        product: product._id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
        image: product.images?.[0] || "",
      });
    }

    const order = await Order.create({
      user: userId,
      items: orderItems,
      totalAmount,
      shippingAddress,
      paymentMethod,
    });

    for (const item of items) {
      await Product.findByIdAndUpdate(item.productId, {
        $inc: { stock: -item.quantity },
      });
    }

    res.status(201).json(order);
  } catch (error: any) {
    console.error("❌ Error in createOrder:", error);
    res.status(500).json({ message: error.message });
  }
};

// گرفتن سفارش‌های کاربر جاری
export const getUserOrders = async (req: AuthRequest, res: Response) => {
  try {

    // ✅ ادمین همه سفارش‌ها، user فقط خودش
    const query = req.user?.role === "admin" ? {} : { user: req.user?._id };

    const orders = await Order.find(query)
      .populate("user", "name email")
      .populate("items.product")
      .sort({ createdAt: -1 });


    res.json(orders);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// گرفتن یک سفارش با ID
export const getOrderById = async (req: AuthRequest, res: Response) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("items.product")
      .populate("user", "name email");

    if (!order) {
      return res.status(404).json({ message: "سفارش یافت نشد" });
    }

    // ✅ safe null check — اگه user حذف شده باشه crash نمیکنه
    let orderUserId: string;
    if (!order.user) {
      // user حذف شده — فقط ادمین میتونه ببینه
      if (req.user?.role !== "admin") {
        return res.status(403).json({ message: "دسترسی غیرمجاز" });
      }
      return res.json(order);
    } else if ((order.user as any)._id) {
      // populate شده
      orderUserId = (order.user as any)._id.toString();
    } else {
      // populate نشده — raw ObjectId
      orderUserId = order.user.toString();
    }

    if (
      orderUserId !== req.user?._id.toString() &&
      req.user?.role !== "admin"
    ) {
      return res.status(403).json({ message: "دسترسی غیرمجاز" });
    }

    res.json(order);
  } catch (error: any) {
    console.error("getOrderById error:", error.message);
    res.status(500).json({ message: error.message });
  }
};

// گرفتن همه سفارش‌ها (فقط ادمین)
export const getAllOrders = async (req: AuthRequest, res: Response) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .populate("items.product")
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ به‌روزرسانی وضعیت سفارش (فقط ادمین)
export const updateOrderStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { status } = req.body;

    // ✅ وضعیت‌های مجاز
    const validStatuses = [
      "pending",
      "processing",
      "shipped",
      "delivered",
      "cancelled",
      "refunded",
    ];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "وضعیت نامعتبر است" });
    }

    // ✅ اگه refunded شد، paymentStatus هم آپدیت میشه
    const updateData: any = { status };
    if (status === "refunded") {
      updateData.paymentStatus = "refunded";
    }

    const order = await Order.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    });

    if (!order) {
      return res.status(404).json({ message: "سفارش یافت نشد" });
    }

    res.json(order);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
