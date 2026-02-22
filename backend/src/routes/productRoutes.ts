import express from "express";
import {
  getProducts,
  getProductBySlug,
  getProductByCategory,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController";
import { protect, admin } from "../middleware/authMiddleware";
import { uploadProductImages } from "../config/cloudinary"; // ✅ Cloudinary

const router = express.Router();

// ✅ مسیرهای ثابت — اول
router.get("/", getProducts);
router.get("/category/:slug", getProductByCategory);

// ✅ مسیرهای ID
router.get("/id/:id", getProductById);

// ✅ مسیرهای نیازمند احراز هویت
router.post(
  "/",
  protect,
  admin,
  uploadProductImages.array("images", 5),
  createProduct,
);
router.put(
  "/id/:id",
  protect,
  admin,
  uploadProductImages.array("images", 5),
  updateProduct,
);
router.delete("/id/:id", protect, admin, deleteProduct);

// ✅ مسیر slug — همیشه آخر
router.get("/:slug", getProductBySlug);

export default router;
