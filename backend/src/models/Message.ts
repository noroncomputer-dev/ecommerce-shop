import mongoose, { Schema, Document } from "mongoose";

export interface IMessage extends Document {
  name: string;
  email: string;
  phone?: string;
  userId?: mongoose.Types.ObjectId; // برای کاربران وارد شده
  subject: string;
  message: string;
  status: "pending" | "read" | "replied";
  repliedAt?: Date;
  reply?: string;
  readByUser?: boolean; // آیا کاربر پاسخ رو دیده
  createdAt: Date;
  updatedAt: Date;
}

const MessageSchema = new Schema<IMessage>(
  {
    name: {
      type: String,
      required: [true, "نام الزامی است"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "ایمیل الزامی است"],
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "ایمیل نامعتبر است"],
    },
    phone: {
      type: String,
      trim: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    subject: {
      type: String,
      required: [true, "موضوع الزامی است"],
      trim: true,
    },
    message: {
      type: String,
      required: [true, "متن پیام الزامی است"],
    },
    status: {
      type: String,
      enum: ["pending", "read", "replied"],
      default: "pending",
    },
    repliedAt: {
      type: Date,
    },
    reply: {
      type: String,
    },
    readByUser: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

// ایندکس برای جستجو
MessageSchema.index({
  name: "text",
  email: "text",
  subject: "text",
  message: "text",
});

export default mongoose.model<IMessage>("Message", MessageSchema);
