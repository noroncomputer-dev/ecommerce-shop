import mongoose, { Schema, Document } from "mongoose";

export interface IAbout extends Document {
  title: string;
  description: string;
  mission: string;
  vision: string;
  history: string;
  stats: {
    products: number;
    customers: number;
    experience: number;
    support: string;
  };
  contact: {
    phone: string[];
    email: string[];
    address: string;
    hours: string;
  };
  socialMedia: {
    instagram?: string;
    telegram?: string;
    twitter?: string;
    linkedin?: string;
    whatsapp?: string;
    youtube?: string;
    aparat?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const AboutSchema = new Schema<IAbout>(
  {
    title: {
      type: String,
      required: [true, "عنوان فروشگاه الزامی است"],
    },
    description: {
      type: String,
      required: [true, "توضیحات فروشگاه الزامی است"],
    },
    mission: {
      type: String,
      required: [true, "ماموریت فروشگاه الزامی است"],
    },
    vision: {
      type: String,
      required: [true, "چشم‌انداز فروشگاه الزامی است"],
    },
    history: {
      type: String,
      required: [true, "تاریخچه فروشگاه الزامی است"],
    },
    stats: {
      products: { type: Number, default: 0 },
      customers: { type: Number, default: 0 },
      experience: { type: Number, default: 0 },
      support: { type: String, default: "۲۴/۷" },
    },
    contact: {
      phone: [{ type: String }],
      email: [{ type: String }],
      address: { type: String },
      hours: { type: String },
    },
    socialMedia: {
      instagram: { type: String, default: null },
      telegram: { type: String, default: null },
      twitter: { type: String, default: null },
      linkedin: { type: String, default: null },
      whatsapp: { type: String, default: null },
      youtube: { type: String, default: null },
      aparat: { type: String, default: null },
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model<IAbout>("About", AboutSchema);
