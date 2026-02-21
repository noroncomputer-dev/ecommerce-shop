import { Request, Response } from "express";
import User from "../models/User";
import jwt from "jsonwebtoken";

// تابع تولید توکن
const generateToken = (id: string) => {
  return jwt.sign({ id }, process.env.JWT_SECRET!, {
    expiresIn: "30d",
  });
};

// ثبت‌نام کاربر
export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "لطفاً همه فیلدها را پر کنید" });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "این ایمیل قبلاً ثبت شده است" });
    }

    const user = await User.create({ name, email, password });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      profile: user.profile, // ✅ اضافه شد
      token: generateToken(user._id.toString()),
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ message: "خطای سرور" });
  }
};

// احراز هویت کاربر
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "لطفاً ایمیل و رمز عبور را وارد کنید" });
    }

    // ✅ password و profile هر دو select میشن
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(401).json({ message: "ایمیل یا رمز عبور اشتباه است" });
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({ message: "ایمیل یا رمز عبور اشتباه است" });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      profile: user.profile, // ✅ اضافه شد — آواتار در navbar نشون داده میشه
      token: generateToken(user._id.toHexString()),
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "خطای سرور" });
  }
};
