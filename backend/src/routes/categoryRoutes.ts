import express from "express";
import {
  getCategories,
  getCategoryById,
  getCategoryBySlug,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/categoryController";
import { protect, admin } from "../middleware/authMiddleware";

const router = express.Router();

// =============== مسیرهای عمومی ===============
router.get("/", getCategories);
router.get("/slug/:slug", getCategoryBySlug);
router.get("/:id", getCategoryById);  // این خط رو حتماً داشته باش

// =============== مسیرهای محافظت شده ===============
router.post("/", protect, admin, createCategory);
router.put("/:id", protect, admin, updateCategory);
router.delete("/:id", protect, admin, deleteCategory);

export default router;