import mongoose, { Schema, Document } from "mongoose";

export interface ISlider extends Document {
  title: string;
  subtitle: string;
  description: string;
  image: string;
  link: string;
  buttonText: string;
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const SliderSchema = new Schema<ISlider>(
  {
    title: {
      type: String,
      required: [true, "عنوان اسلایدر الزامی است"],
    },
    subtitle: {
      type: String,
      required: [true, "زیرعنوان اسلایدر الزامی است"],
    },
    description: {
      type: String,
      required: [true, "توضیحات اسلایدر الزامی است"],
    },
    image: {
      type: String,
      required: [true, "تصویر اسلایدر الزامی است"],
    },
    link: {
      type: String,
      default: "/products",
    },
    buttonText: {
      type: String,
      default: "مشاهده محصولات",
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

export default mongoose.model<ISlider>("Slider", SliderSchema);
