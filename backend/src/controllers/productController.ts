import { Request, Response } from "express";
import { AuthRequest } from "../middleware/authMiddleware";
import Product from "../models/Product";
import Category from "../models/Category";
import { cloudinary } from "../config/cloudinary";

// ── ایجاد محصول ─────────────────────────────────────────
export const createProduct = async (req: AuthRequest, res: Response) => {
  try {
    const { name, description, price, category, stock, attributes } = req.body;
    const files = req.files as Express.Multer.File[];

    if (!name || !description || !price || !category) {
      return res
        .status(400)
        .json({ message: "لطفاً همه فیلدهای الزامی را پر کنید" });
    }

    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return res.status(400).json({ message: "دسته‌بندی نامعتبر است" });
    }

    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9آ-ی]/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");

    // ✅ Cloudinary URL ها رو از multer میگیریم
    let imagePaths: string[] = [];
    if (files && files.length > 0) {
      imagePaths = files.map((file: any) => file.path); // Cloudinary URL
    }

    const product = await Product.create({
      name,
      slug,
      description,
      price: Number(price),
      category,
      images: imagePaths,
      stock: Number(stock) || 0,
      attributes: attributes ? JSON.parse(attributes) : {},
    });

    const populatedProduct = await Product.findById(product._id).populate(
      "category",
      "name slug",
    );
    res.status(201).json(populatedProduct);
  } catch (error: any) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "این محصول قبلاً وجود دارد" });
    }
    res.status(500).json({ message: "خطای سرور", error: error.message });
  }
};

// ── گرفتن همه محصولات ───────────────────────────────────
export const getProducts = async (req: Request, res: Response) => {
  try {
    const {
      category,
      page = 1,
      limit = 1000,
      search,
      minPrice,
      maxPrice,
      sort,
    } = req.query;

    const filter: any = {};
    if (category) filter.category = category;
    if (search) filter.name = { $regex: search, $options: "i" };
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    const pageNum = Number(page);
    const limitNum = Number(limit);
    const skip = (pageNum - 1) * limitNum;

    const total = await Product.countDocuments(filter);
    const products = await Product.find(filter)
      .populate("category", "name slug")
      .skip(skip)
      .limit(limitNum)
      .sort(sort ? { [sort as string]: 1 } : { createdAt: -1 });

    res.json({
      products,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// ── گرفتن محصول با slug ──────────────────────────────────
export const getProductBySlug = async (req: Request, res: Response) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug }).populate(
      "category",
      "name slug",
    );
    if (!product) return res.status(404).json({ message: "محصول یافت نشد" });
    res.json(product);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// ── گرفتن محصولات بر اساس دسته‌بندی ────────────────────
export const getProductByCategory = async (req: Request, res: Response) => {
  try {
    const category = await Category.findOne({ slug: req.params.slug });
    if (!category)
      return res.status(404).json({ message: "دسته‌بندی یافت نشد" });

    const products = await Product.find({ category: category._id }).populate(
      "category",
      "name slug",
    );
    res.json({ category, products });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// ── گرفتن محصول با ID ───────────────────────────────────
export const getProductById = async (req: AuthRequest, res: Response) => {
  try {
    const product = await Product.findById(req.params.id).populate(
      "category",
      "name slug",
    );
    if (!product) return res.status(404).json({ message: "محصول یافت نشد" });
    res.json(product);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// ── ویرایش محصول ────────────────────────────────────────
export const updateProduct = async (req: AuthRequest, res: Response) => {
  try {
    const files = req.files as Express.Multer.File[];
    const { name, description, price, category, stock, attributes } = req.body;

    // تصاویر موجود که کاربر نگه داشته
    let existingImages: string[] = [];
    if (req.body.existingImages) {
      existingImages = Array.isArray(req.body.existingImages)
        ? req.body.existingImages
        : [req.body.existingImages];
    }

    // ✅ تصاویر جدید از Cloudinary
    let newImagePaths: string[] = [];
    if (files && files.length > 0) {
      newImagePaths = files.map((file: any) => file.path);
    }

    const finalImages = [...existingImages, ...newImagePaths];

    const updates: any = {};
    if (name) updates.name = name;
    if (description) updates.description = description;
    if (price) updates.price = Number(price);
    if (category) updates.category = category;
    if (stock !== undefined) updates.stock = Number(stock);
    if (attributes)
      updates.attributes =
        typeof attributes === "string" ? JSON.parse(attributes) : attributes;
    if (finalImages.length > 0) updates.images = finalImages;

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true, runValidators: true },
    ).populate("category");

    if (!product) return res.status(404).json({ message: "محصول یافت نشد" });
    res.json(product);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// ── حذف محصول ───────────────────────────────────────────
export const deleteProduct = async (req: AuthRequest, res: Response) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "محصول یافت نشد" });

    // ✅ حذف تصاویر از Cloudinary
    for (const imageUrl of product.images) {
      try {
        const publicId = imageUrl.split("/").slice(-2).join("/").split(".")[0];
        await cloudinary.uploader.destroy(publicId);
      } catch (e) {}
    }

    await product.deleteOne();
    res.json({ message: "محصول با موفقیت حذف شد" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
