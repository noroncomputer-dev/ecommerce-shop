import express from "express";
import {
  getFAQs,
  addFAQ,
  updateFAQ,
  deleteFAQ,
  toggleFaqMemberStatus,
} from "../controllers/faqController";
import { protect, admin } from "../middleware/authMiddleware";

const router = express.Router();

router.get("/", getFAQs);
router.post("/", protect, admin, addFAQ);
router.put("/:id", protect, admin, updateFAQ);
router.delete("/:id", protect, admin, deleteFAQ);
router.patch("/:id/toggle", protect, admin, toggleFaqMemberStatus);

export default router;
