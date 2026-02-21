import { Request, Response } from "express";
import { AuthRequest } from "../middleware/authMiddleware";
import Team from "../models/Team";

// دریافت لیست تیم
export const getTeam = async (req: Request, res: Response) => {
  try {
    const team = await Team.find().sort({ order: 1 });
    res.json(team);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
export const toggleTeamMemberStatus = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const member = await Team.findById(req.params.id);

    if (!member) {
      return res.status(404).json({ message: "عضو تیم یافت نشد" });
    }

    member.isActive = !member.isActive;
    await member.save();

    res.json({
      message: `عضو تیم ${member.isActive ? "فعال" : "غیرفعال"} شد`,
      isActive: member.isActive,
    });
  } catch (error: any) {
    console.error("Error in toggleTeamMemberStatus:", error);
    res.status(500).json({ message: error.message });
  }
};
// اضافه کردن عضو جدید (فقط ادمین)
export const addTeamMember = async (req: AuthRequest, res: Response) => {
  try {
    const member = await Team.create(req.body);
    res.status(201).json(member);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// ویرایش عضو (فقط ادمین)
export const updateTeamMember = async (req: AuthRequest, res: Response) => {
  try {
    const member = await Team.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true },
    );
    res.json(member);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// حذف عضو (فقط ادمین)
export const deleteTeamMember = async (req: AuthRequest, res: Response) => {
  try {
    await Team.findByIdAndDelete(req.params.id);
    res.json({ message: "عضو با موفقیت حذف شد" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
