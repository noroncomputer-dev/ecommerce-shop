import { Request, Response } from "express";
import Message from "../models/Message";
import { AuthRequest } from "../middleware/authMiddleware";
import mongoose from "mongoose";

// =============== ارسال پیام جدید (عمومی) ===============
export const sendMessage = async (req: AuthRequest, res: Response) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        message: "لطفاً فیلدهای اجباری را پر کنید",
      });
    }

    const userId = req.user?._id as mongoose.Types.ObjectId | undefined;

    const newMessage = await Message.create({
      name,
      email,
      phone: phone || undefined,
      ...(userId && { userId }),
      subject,
      message,
      status: "pending",
    });

    res.status(201).json({
      message: "پیام شما با موفقیت ارسال شد",
      id: newMessage._id,
    });
  } catch (error: any) {
    console.error("🔴 Error in sendMessage:", error);
    res.status(500).json({ message: error.message });
  }
};

// =============== دریافت همه پیام‌های کاربر (برای پروفایل) ===============
export const getUserMessages = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "لطفاً وارد شوید" });
    }

    const userId = req.user._id;
    const userEmail = req.user.email;
    const userRole = req.user.role;

    let query: any = {};

    // برای ادمین: همه پیام‌هایی که خودش فرستاده یا بهش مربوطه
    if (userRole === "admin") {
      query = {
        $or: [{ userId: userId }, { email: userEmail }],
      };
    } else {
      // برای کاربر عادی: فقط پیام‌هایی که خودش فرستاده
      query = {
        $or: [{ userId: userId }, { email: userEmail }],
      };
    }

    const messages = await Message.find(query).sort({ createdAt: -1 });

    res.json(messages);
  } catch (error: any) {
    console.error("🔴 Error in getUserMessages:", error);
    res.status(500).json({ message: error.message });
  }
};

// =============== دریافت پیام‌های خوانده نشده کاربر ===============
export const getUnreadUserMessages = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    if (!req.user?._id) {
      return res.status(401).json({ message: "لطفاً وارد شوید" });
    }

    const userId = req.user._id;
    const userEmail = req.user.email;
    const userRole = req.user.role;

    let query: any = {
      status: "replied",
      readByUser: false,
    };

    // برای ادمین: پیام‌هایی که دیگران فرستادن (نه خودش)
    if (userRole === "admin") {
      query.userId = { $ne: userId }; // کاربر فرستنده نباشه
    } else {
      // برای کاربر عادی: پیام‌هایی که خودش فرستاده
      query.userId = userId;
    }

    const messages = await Message.find(query).sort({ repliedAt: -1 });

    res.json(messages);
  } catch (error: any) {
    console.error("🔴 Error in getUnreadUserMessages:", error);
    res.status(500).json({ message: error.message });
  }
};

// =============== دریافت همه پیام‌ها (فقط ادمین) ===============
export const getAllMessages = async (req: AuthRequest, res: Response) => {
  try {
    const { status, search } = req.query;
    const filter: any = {};

    if (status) filter.status = status;
    if (search) filter.$text = { $search: search as string };

    const messages = await Message.find(filter)
      .populate("userId", "name email")
      .sort({ createdAt: -1 });

    res.json(messages);
  } catch (error: any) {
    console.error("Error in getAllMessages:", error);
    res.status(500).json({ message: error.message });
  }
};

// =============== دریافت یک پیام با ID (فقط ادمین) ===============
export const getMessageById = async (req: AuthRequest, res: Response) => {
  try {
    const message = await Message.findById(req.params.id).populate(
      "userId",
      "name email",
    );

    if (!message) {
      return res.status(404).json({ message: "پیام یافت نشد" });
    }

    res.json(message);
  } catch (error: any) {
    console.error("Error in getMessageById:", error);
    res.status(500).json({ message: error.message });
  }
};

// =============== تغییر وضعیت پیام (فقط ادمین) ===============
export const updateMessageStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { status, reply } = req.body;

    if (!["pending", "read", "replied"].includes(status)) {
      return res.status(400).json({ message: "وضعیت نامعتبر است" });
    }

    const updateData: any = { status };

    if (status === "replied") {
      updateData.repliedAt = new Date();
      if (reply) updateData.reply = reply;
      updateData.readByUser = false;
    }

    const message = await Message.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    });

    if (!message) {
      return res.status(404).json({ message: "پیام یافت نشد" });
    }

    res.json({
      message: `وضعیت پیام به ${status} تغییر کرد`,
      data: message,
    });
  } catch (error: any) {
    console.error("Error in updateMessageStatus:", error);
    res.status(500).json({ message: error.message });
  }
};

// =============== پاسخ به پیام (فقط ادمین) ===============
export const replyToMessage = async (req: AuthRequest, res: Response) => {
  try {
    const { reply } = req.body;

    if (!reply) {
      return res.status(400).json({ message: "متن پاسخ الزامی است" });
    }

    const message = await Message.findByIdAndUpdate(
      req.params.id,
      {
        status: "replied",
        reply,
        repliedAt: new Date(),
        readByUser: false,
      },
      { new: true },
    );

    if (!message) {
      return res.status(404).json({ message: "پیام یافت نشد" });
    }

    res.json({
      message: "پاسخ با موفقیت ثبت شد",
      data: message,
    });
  } catch (error: any) {
    console.error("Error in replyToMessage:", error);
    res.status(500).json({ message: error.message });
  }
};

// =============== علامت خوانده شده توسط کاربر ===============
export const markMessageAsReadByUser = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    if (!req.user?._id) {
      return res.status(401).json({ message: "لطفاً وارد شوید" });
    }

    const message = await Message.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { readByUser: true },
      { new: true },
    );

    if (!message) {
      return res.status(404).json({ message: "پیام یافت نشد" });
    }

    res.json({ message: "پیام به عنوان خوانده شده علامت زده شد" });
  } catch (error: any) {
    console.error("Error in markMessageAsReadByUser:", error);
    res.status(500).json({ message: error.message });
  }
};

// =============== حذف پیام (فقط ادمین) ===============
export const deleteMessage = async (req: AuthRequest, res: Response) => {
  try {
    const message = await Message.findById(req.params.id);

    if (!message) {
      return res.status(404).json({ message: "پیام یافت نشد" });
    }

    await message.deleteOne();

    res.json({ message: "پیام با موفقیت حذف شد" });
  } catch (error: any) {
    console.error("Error in deleteMessage:", error);
    res.status(500).json({ message: error.message });
  }
};
