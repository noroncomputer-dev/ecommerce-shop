import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User, { IUser } from "../models/User";

export interface AuthRequest extends Request {
  user?: IUser;
}

export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ message: "هدر Authorization یافت نشد" });
    }

    const parts = authHeader.split(" ");
    if (parts.length !== 2 || parts[0] !== "Bearer") {
      return res.status(401).json({
        message: 'فرمت هدر باید به صورت "Bearer [token]" باشد',
        received: authHeader,
      });
    }

    const token = parts[1];

    if (!token || token.length < 10) {
      return res.status(401).json({
        message: "توکن نامعتبر است - طول توکن ناکافی",
        length: token?.length,
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret");

    // @ts-ignore
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({ message: "کاربر یافت نشد" });
    }

    // @ts-ignore
    req.user = user;
    next();
  } catch (error: any) {
    return res.status(401).json({
      message: "خطا در اعتبارسنجی توکن",
      error: error.message,
    });
  }
};
export const admin = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ message: "دسترسی غیرمجاز - کاربر یافت نشد" });
  }

  if (req.user.role === "admin") {
    next();
  } else {
    return res
      .status(403)
      .json({ message: "دسترسی غیرمجاز - نیاز به سطح ادمین" });
  }
};
