import express from "express";
import {
  getTeam,
  addTeamMember,
  updateTeamMember,
  deleteTeamMember,
  toggleTeamMemberStatus,
} from "../controllers/teamController";
import { protect, admin } from "../middleware/authMiddleware";

const router = express.Router();

router.get("/", getTeam);
router.post("/", protect, admin, addTeamMember);
router.put("/:id", protect, admin, updateTeamMember);
router.delete("/:id", protect, admin, deleteTeamMember);
router.patch("/:id/toggle", protect, admin, toggleTeamMemberStatus);

export default router;
