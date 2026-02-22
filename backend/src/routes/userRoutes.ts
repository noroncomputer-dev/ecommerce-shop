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
import { uploadAvatar as uploadAvatarMiddleware } from "../config/cloudinary"; // ✅ Cloudinary

const router = express.Router();

// =============== مسیرهای مدیریت (فقط ادمین) ===============
router.get("/", protect, admin, getAllUsers);
router.put("/:id/role", protect, admin, updateUserRole);
router.delete("/:id", protect, admin, deleteUser);

// =============== مسیرهای پروفایل ===============
router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);
router.put("/change-password", protect, changePassword);
router.post(
  "/avatar",
  protect,
  uploadAvatarMiddleware.single("avatar"),
  uploadAvatar,
); // ✅ Cloudinary

export default router;
