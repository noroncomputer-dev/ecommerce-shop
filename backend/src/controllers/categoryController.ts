import { Request, Response } from "express";
import mongoose from "mongoose";
import { AuthRequest } from "../middleware/authMiddleware";
import Category from "../models/Category";

// =============== دریافت همه دسته‌بندی‌ها ===============
export const getCategories = async (req: Request, res: Response) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });
    res.status(200).json(categories);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// =============== دریافت یک دسته‌بندی با ID ===============
export const getCategoryById = async (req: Request, res: Response) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid category ID" });
    }

    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.status(200).json(category); // 🔑 فراموش نشه
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// =============== دریافت یک دسته‌بندی با slug ===============
export const getCategoryBySlug = async (req: Request, res: Response) => {
  try {
    const category = await Category.findOne({ slug: req.params.slug });

    if (!category) {
      return res.status(404).json({ message: "دسته‌بندی یافت نشد" });
    }

    res.status(200).json(category);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// =============== ایجاد دسته‌بندی جدید ===============
export const createCategory = async (req: AuthRequest, res: Response) => {
  try {
    const { name, image } = req.body;

    // اعتبارسنجی
    if (!name) {
      return res.status(400).json({ message: "نام دسته‌بندی الزامی است" });
    }

    // ایجاد اسلاگ
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9آ-ی]/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");

    // چک کردن تکراری نبودن
    const existingCategory = await Category.findOne({ slug });
    if (existingCategory) {
      return res.status(400).json({ message: "این دسته‌بندی قبلاً وجود دارد" });
    }

    const category = await Category.create({
      name,
      slug,
      image: image || null,
    });

    res.status(201).json(category);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// =============== ویرایش دسته‌بندی ===============
export const updateCategory = async (req: AuthRequest, res: Response) => {
  try {
    const { name, image } = req.body;
    const updateData: any = {};

    // فقط فیلدهایی که مقدار دارن رو به‌روزرسانی کن
    if (name) {
      updateData.name = name;
      updateData.slug = name
        .toLowerCase()
        .replace(/[^a-z0-9آ-ی]/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "");
    }

    if (image !== undefined) {
      updateData.image = image;
    }

    const category = await Category.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true },
    );

    if (!category) {
      return res.status(404).json({ message: "دسته‌بندی یافت نشد" });
    }

    res.status(200).json(category);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// =============== حذف دسته‌بندی ===============
export const deleteCategory = async (req: AuthRequest, res: Response) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);

    if (!category) {
      return res.status(404).json({ message: "دسته‌بندی یافت نشد" });
    }

    res.status(200).json({ message: "دسته‌بندی با موفقیت حذف شد" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
