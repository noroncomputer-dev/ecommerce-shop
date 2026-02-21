import { Request, Response } from "express";
import About from "../models/About";
import { AuthRequest } from "../middleware/authMiddleware";

// دریافت اطلاعات فروشگاه
export const getAboutInfo = async (req: Request, res: Response) => {
  try {
    let about = await About.findOne();

    // اگر اطلاعاتی وجود نداشت، ایجاد کن
    if (!about) {
      about = await About.create({
        title: "فروشگاه ما",
        description: "بهترین فروشگاه اینترنتی با محصولات اصل",
        mission: "ارائه بهترین خدمات به مشتریان",
        vision: "پیشرو در تجارت الکترونیک",
        history: "از سال ۱۳۹۰ در کنار شما هستیم",
        stats: {
          products: 15000,
          customers: 50000,
          experience: 12,
          support: "۲۴/۷",
        },
        contact: {
          phone: ["۰۲۱-۱۲۳۴۵۶۷۸", "۰۹۱۲-۳۴۵۶۷۸۹"],
          email: ["info@shop.com", "support@shop.com"],
          address: "تهران، خیابان ولیعصر، پلاک ۱۲۳۴",
          hours: "شنبه تا پنجشنبه ۹-۲۱، جمعه ۱۰-۱۸",
        },
        socialMedia: {
          instagram: "https://instagram.com/shop",
          telegram: "https://t.me/shop",
          twitter: "https://twitter.com/shop",
          linkedin: "https://linkedin.com/company/shop",
          whatsapp: "https://wa.me/123456789",
          youtube: "https://youtube.com/@shop",
          aparat: "https://aparat.com/shop",
        },
      });
    }

    res.json(about);
  } catch (error: any) {
    console.error("❌ Error in getAboutInfo:", error);
    res.status(500).json({ message: error.message });
  }
};

// آپدیت اطلاعات (فقط ادمین)
export const updateAboutInfo = async (req: AuthRequest, res: Response) => {
  try {
    const about = await About.findOneAndUpdate(
      {},
      { $set: req.body },
      { new: true, upsert: true, runValidators: true },
    );

    res.json(about);
  } catch (error: any) {
    console.error("❌ Error in updateAboutInfo:", error);
    res.status(500).json({ message: error.message });
  }
};

// آپلود تصویر (برای لوگو یا بنر)
export const uploadAboutImage = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "لطفاً یک تصویر انتخاب کنید" });
    }

    const imageUrl = `/uploads/${req.file.filename}`;

    res.json({ url: imageUrl });
  } catch (error: any) {
    console.error("❌ Error in uploadAboutImage:", error);
    res.status(500).json({ message: error.message });
  }
};
