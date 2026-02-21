import mongoose, { Schema, Document } from "mongoose";

export interface ICategory extends Document {
  name: string;
  slug: string;
  image?: string;
  createdAt: Date;
}

const CategorySchema = new Schema<ICategory>(
  {
    name: {
      type: String,
      required: [true, "نام دسته‌بندی الزامی است"],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, "اسلاگ الزامی است"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    image: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true, // خودکار createdAt و updatedAt رو اضافه می‌کنه
  }
);

// ایجاد اسلاگ خودکار از name
CategorySchema.pre("save", function () {
  if (!this.slug && this.name) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9آ-ی]/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");
  }
});

export default mongoose.model<ICategory>("Category", CategorySchema);