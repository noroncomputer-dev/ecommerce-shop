import { Request, Response } from "express";
import Product from "../models/Product";
import User from "../models/User";
import Order from "../models/Order";

// دریافت آمار فروشگاه
export const getStats = async (req: Request, res: Response) => {
  try {
    const [productsCount, usersCount, ordersCount, totalSales] =
      await Promise.all([
        Product.countDocuments(),
        User.countDocuments(),
        Order.countDocuments(),
        Order.aggregate([
          { $group: { _id: null, total: { $sum: "$totalAmount" } } },
        ]),
      ]);

    res.json({
      products: productsCount,
      users: usersCount,
      orders: ordersCount,
      sales: totalSales[0]?.total || 0,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
