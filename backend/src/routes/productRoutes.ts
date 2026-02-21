import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
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

const router = express.Router();

// ایجاد پوشه uploads اگر وجود نداره
const uploadDir = path.join(__dirname, "../../uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// تنظیمات multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
});

// ✅ ۱. مسیرهای ثابت — اول
router.get("/", getProducts);
router.get("/category/:slug", getProductByCategory);

// ✅ ۲. مسیرهای ID
router.get("/id/:id", getProductById);

// ✅ ۳. مسیرهای نیازمند احراز هویت
router.post("/", protect, admin, upload.array("images", 5), createProduct);
router.put("/id/:id", protect, admin, upload.array("images", 5), updateProduct); // ✅ multer اضافه شد
router.delete("/id/:id", protect, admin, deleteProduct);

// ✅ ۴. مسیر slug — همیشه آخر
router.get("/:slug", getProductBySlug);

export default router;
