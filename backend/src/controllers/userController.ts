import { Request, Response } from "express";
import User from "../models/User";
import { AuthRequest } from "../middleware/authMiddleware";

// گرفتن همه کاربران (فقط ادمین)
export const getAllUsers = async (req: AuthRequest, res: Response) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });

    res.json(users);
  } catch (error: any) {
    console.error("❌ Error fetching users:", error);
    res.status(500).json({ message: error.message });
  }
};

// تغییر نقش کاربر (فقط ادمین)
export const updateUserRole = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.params.id;
    const { role } = req.body;

    if (!["user", "admin"].includes(role)) {
      return res.status(400).json({ message: "نقش نامعتبر است" });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { role },
      { new: true },
    ).select("-password");

    if (!user) {
      return res.status(404).json({ message: "کاربر یافت نشد" });
    }

    res.json(user);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// حذف کاربر (فقط ادمین)
export const deleteUser = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.params.id;

    // جلوگیری از حذف خودش
    if (userId === req.user?._id.toString()) {
      return res.status(400).json({ message: "نمی‌توانید خودتان را حذف کنید" });
    }

    const user = await User.findByIdAndDelete(userId);

    if (!user) {
      return res.status(404).json({ message: "کاربر یافت نشد" });
    }

    res.json({ message: "کاربر با موفقیت حذف شد" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// =============== دریافت پروفایل کاربر جاری ===============
export const getProfile = async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.user?._id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "کاربر یافت نشد" });
    }

    res.json(user);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// =============== ویرایش پروفایل ===============
export const updateProfile = async (req: AuthRequest, res: Response) => {
  try {
    const { name, profile } = req.body;

    const updateData: any = {};
    if (name) updateData.name = name;
    if (profile) updateData.profile = profile;

    const user = await User.findByIdAndUpdate(
      req.user?._id,
      { $set: updateData },
      { new: true, runValidators: true },
    ).select("-password");

    if (!user) {
      return res.status(404).json({ message: "کاربر یافت نشد" });
    }

    res.json(user);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// =============== تغییر رمز عبور ===============
export const changePassword = async (req: AuthRequest, res: Response) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // اعتبارسنجی
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "لطفاً همه فیلدها را پر کنید" });
    }

    if (newPassword.length < 6) {
      return res
        .status(400)
        .json({ message: "رمز عبور جدید باید حداقل ۶ کاراکتر باشد" });
    }

    // پیدا کردن کاربر با پسورد
    const user = await User.findById(req.user?._id).select("+password");

    if (!user) {
      return res.status(404).json({ message: "کاربر یافت نشد" });
    }

    // بررسی رمز فعلی
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ message: "رمز عبور فعلی اشتباه است" });
    }

    // تنظیم رمز جدید
    user.password = newPassword;
    await user.save();

    res.json({ message: "رمز عبور با موفقیت تغییر کرد" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// =============== آپلود آواتار ===============
export const uploadAvatar = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "لطفاً یک تصویر انتخاب کنید" });
    }

    const avatarUrl = `/uploads/${req.file.filename}`;

    const user = await User.findByIdAndUpdate(
      req.user?._id,
      { $set: { "profile.avatar": avatarUrl } },
      { new: true },
    ).select("-password");

    res.json({ avatar: avatarUrl, user });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
