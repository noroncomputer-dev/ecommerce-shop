import express from "express";
import {
  getAllUsers,
  updateUserRole,
  deleteUser,
  getProfile,
  updateProfile,
  changePassword,
  uploadAvatar,
} from "../controllers/userController";
import { protect, admin } from "../middleware/authMiddleware";
import multer from "multer";
import path from "node:path";

const router = express.Router();
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../../uploads"));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, "avatar-" + uniqueSuffix + path.extname(file.originalname));
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});
// =============== مسیرهای مدیریت (فقط ادمین) ===============
router.get("/", protect, admin, getAllUsers);
router.put("/:id/role", protect, admin, updateUserRole);
router.delete("/:id", protect, admin, deleteUser);

// =============== مسیرهای پروفایل ===============
router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);
router.put("/change-password", protect, changePassword);
router.post("/avatar", protect, upload.single("avatar"), uploadAvatar);

export default router;
