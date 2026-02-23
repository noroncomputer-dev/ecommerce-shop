import express from "express";
import multer from "multer";
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

// ✅ Cloudinary - تصویر در memory نگه داشته میشه نه disk
const upload = multer({
  storage: multer.memoryStorage(),
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
