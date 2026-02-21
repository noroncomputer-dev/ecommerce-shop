import mongoose, { Schema, Document } from "mongoose";

export interface IProduct extends Document {
  name: string;
  slug: string;
  description: string;
  price: number;
  category: mongoose.Types.ObjectId;
  images: string[];
  stock: number;
  attributes: Map<string, string | number>;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: [true, "نام محصول الزامی است"],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, "اسلاگ الزامی است"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      required: [true, "توضیحات محصول الزامی است"],
    },
    price: {
      type: Number,
      required: [true, "قیمت محصول الزامی است"],
      min: [0, "قیمت نمیتواند منفی باشد"],
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "دسته بندی محصول الزامی است"],
    },
    images: {
      type: [String],
      default: [],
    },
    stock: {
      type: Number,
      required: [true, "موجودی محصول الزامی است"],
      min: [0, "موجودی نمی تواند منفی باشد"],
      default: 0,
    },
    attributes: {
      type: Map,
      of: Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  },
);

ProductSchema.pre("save", function () {
  if (!this.slug && this.name) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9آ-ی]/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");
  }
});


export default mongoose.model<IProduct>("Product", ProductSchema);
