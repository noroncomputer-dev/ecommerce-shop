import express from "express";
import multer from "multer";
import path from "path";
import {
  getActiveSliders,
  getAllSliders,
  createSlider,
  updateSlider,
  deleteSlider,
  toggleSliderStatus,
  uploadSliderImage,
} from "../controllers/sliderController";
import { protect, admin } from "../middleware/authMiddleware";

const router = express.Router();

// تنظیمات multer برای آپلود تصویر
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../../uploads"));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, "slider-" + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("فقط فایل‌های تصویر مجاز هستند"));
    }
  },
});

// مسیرهای عمومی
router.get("/active", getActiveSliders);

// مسیرهای محافظت شده (فقط ادمین)
router.get("/", protect, admin, getAllSliders);
router.post("/", protect, admin, createSlider);
router.post(
  "/upload",
  protect,
  admin,
  upload.single("image"),
  uploadSliderImage,
);
router.put("/:id", protect, admin, updateSlider);
router.delete("/:id", protect, admin, deleteSlider);
router.patch("/:id/toggle", protect, admin, toggleSliderStatus);

export default router;
