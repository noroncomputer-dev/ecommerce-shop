import { Request, Response } from "express";
import Slider from "../models/Slider";
import { AuthRequest } from "../middleware/authMiddleware";
import { v2 as cloudinary } from "cloudinary";

// ✅ تنظیم Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// دریافت اسلایدرهای فعال
export const getActiveSliders = async (req: Request, res: Response) => {
  try {
    const sliders = await Slider.find({ isActive: true })
      .sort({ order: 1 })
      .limit(5);
    res.json(sliders);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// دریافت همه اسلایدرها (فقط ادمین)
export const getAllSliders = async (req: AuthRequest, res: Response) => {
  try {
    const sliders = await Slider.find().sort({ order: 1 });
    res.json(sliders);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// ایجاد اسلایدر جدید (فقط ادمین)
export const createSlider = async (req: AuthRequest, res: Response) => {
  try {
    const { title, subtitle, description, image, link, buttonText, order } =
      req.body;

    const slider = await Slider.create({
      title,
      subtitle,
      description,
      image,
      link: link || "/products",
      buttonText: buttonText || "مشاهده محصولات",
      order: order || 0,
    });

    res.status(201).json(slider);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// ویرایش اسلایدر (فقط ادمین)
export const updateSlider = async (req: AuthRequest, res: Response) => {
  try {
    const slider = await Slider.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true },
    );

    if (!slider) {
      return res.status(404).json({ message: "اسلایدر یافت نشد" });
    }

    res.json(slider);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// حذف اسلایدر (فقط ادمین)
export const deleteSlider = async (req: AuthRequest, res: Response) => {
  try {
    const slider = await Slider.findById(req.params.id);

    if (!slider) {
      return res.status(404).json({ message: "اسلایدر یافت نشد" });
    }

    await slider.deleteOne();
    res.json({ message: "اسلایدر با موفقیت حذف شد" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// تغییر وضعیت فعال/غیرفعال (فقط ادمین)
export const toggleSliderStatus = async (req: AuthRequest, res: Response) => {
  try {
    const slider = await Slider.findById(req.params.id);

    if (!slider) {
      return res.status(404).json({ message: "اسلایدر یافت نشد" });
    }

    slider.isActive = !slider.isActive;
    await slider.save();

    res.json({
      message: `اسلایدر ${slider.isActive ? "فعال" : "غیرفعال"} شد`,
      isActive: slider.isActive,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ آپلود تصویر به Cloudinary
export const uploadSliderImage = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "لطفاً یک تصویر انتخاب کنید" });
    }

    // آپلود به Cloudinary از buffer
    const result = await new Promise<any>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: "sliders" },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        },
      );
      stream.end(req.file!.buffer);
    });

    res.json({ url: result.secure_url });
  } catch (error: any) {
    console.error("Error in uploadSliderImage:", error);
    res.status(500).json({ message: error.message });
  }
};
