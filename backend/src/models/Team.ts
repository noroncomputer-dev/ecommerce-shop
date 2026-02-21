import mongoose, { Schema, Document } from "mongoose";

export interface ITeam extends Document {
  name: string;
  position: string;
  bio: string;
  avatar?: string;
  email?: string;
  socialMedia?: {
    linkedin?: string;
    twitter?: string;
    instagram?: string;
    github?: string;
  };
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const TeamSchema = new Schema<ITeam>(
  {
    name: {
      type: String,
      required: [true, "نام عضو تیم الزامی است"],
      trim: true,
    },
    position: {
      type: String,
      required: [true, "سمت عضو تیم الزامی است"],
      trim: true,
    },
    bio: {
      type: String,
      required: [true, "بیوگرافی الزامی است"],
    },
    avatar: {
      type: String,
      default: null,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "ایمیل نامعتبر است"],
    },
    socialMedia: {
      linkedin: { type: String, default: null },
      twitter: { type: String, default: null },
      instagram: { type: String, default: null },
      github: { type: String, default: null },
    },
    order: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

// ایندکس برای مرتب‌سازی
TeamSchema.index({ order: 1, createdAt: -1 });

export default mongoose.model<ITeam>("Team", TeamSchema);
