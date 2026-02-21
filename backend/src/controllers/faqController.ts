import { Request, Response } from "express";
import FAQ from "../models/FAQ";
import { AuthRequest } from "../middleware/authMiddleware";

// دریافت سوالات متداول
export const getFAQs = async (req: Request, res: Response) => {
  try {
    const { category } = req.query;
    const filter: any = { isActive: true };

    if (category) {
      filter.category = category;
    }

    const faqs = await FAQ.find(filter).sort({ order: 1 });
    res.json(faqs);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
export const toggleFaqMemberStatus = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const member = await FAQ.findById(req.params.id);

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
// اضافه کردن سوال جدید (فقط ادمین)
export const addFAQ = async (req: AuthRequest, res: Response) => {
  try {
    const faq = await FAQ.create(req.body);
    res.status(201).json(faq);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// ویرایش سوال (فقط ادمین)
export const updateFAQ = async (req: AuthRequest, res: Response) => {
  try {
    const faq = await FAQ.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true },
    );
    res.json(faq);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// حذف سوال (فقط ادمین)
export const deleteFAQ = async (req: AuthRequest, res: Response) => {
  try {
    await FAQ.findByIdAndDelete(req.params.id);
    res.json({ message: "سوال با موفقیت حذف شد" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
