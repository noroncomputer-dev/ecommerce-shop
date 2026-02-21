import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: "user" | "admin";
  profile?: {
    avatar?: string;
    phone?: string;
    address?: string;
    city?: string;
    postalCode?: string;
    birthDate?: Date;
  };
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, "نام الزامی است"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "ایمیل الزامی است"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "ایمیل نامعتبر است"],
    },
    password: {
      type: String,
      required: [true, "رمز عبور الزامی است"],
      minlength: [6, "رمز عبور باید حداقل ۶ کاراکتر باشد"],
      select: false,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    profile: {
      avatar: { type: String, default: null },
      phone: { type: String, default: null },
      address: { type: String, default: null },
      city: { type: String, default: null },
      postalCode: { type: String, default: null },
      birthDate: { type: Date, default: null },
    },
  },
  {
    timestamps: true,
  },
);

// هش کردن پسورد قبل از ذخیره
UserSchema.pre("save", async function () {
  if (!this.isModified("password")) return; // ← return اضافه شد

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  } catch (error) {
    console.error("Error hashing password:", error);
  }
});

// متد مقایسه پسورد
UserSchema.methods.comparePassword = async function (
  candidatePassword: string,
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model<IUser>("User", UserSchema);
