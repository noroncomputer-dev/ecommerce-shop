import express from "express";
import multer from "multer";
import path from "path";
import {
  getAboutInfo,
  updateAboutInfo,
  uploadAboutImage,
} from "../controllers/aboutController";
import { protect, admin } from "../middleware/authMiddleware";

const router = express.Router();

// تنظیمات multer برای آپلود تصویر
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../../uploads"));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, "about-" + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

// مسیرهای عمومی
router.get("/", getAboutInfo);

// مسیرهای محافظت شده (فقط ادمین)
router.put("/", protect, admin, updateAboutInfo);
router.post(
  "/upload",
  protect,
  admin,
  upload.single("image"),
  uploadAboutImage,
);

export default router;
