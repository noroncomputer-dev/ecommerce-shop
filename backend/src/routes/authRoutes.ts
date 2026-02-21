import express from "express";
import { login, register } from "../controllers/authController";
import User from "../models/User"; // ✅ این را اضافه کنید

const router = express.Router();

// مسیر ثبت‌نام
router.post("/register", register);
router.post("/login", login);
router.post("/fix-password", async (req, res) => {
  const { email, newPassword } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    user.password = newPassword;
    await user.save();
    res.json({ message: "پسورد ریست شد" });
  } else {
    res.status(404).json({ message: "کاربر پیدا نشد" });
  }
});

export default router;
