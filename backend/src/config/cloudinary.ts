import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";

// ── Config ──────────────────────────────────────────────
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ── Storage برای محصولات ────────────────────────────────
const productStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "norontech/products",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    transformation: [
      { width: 800, height: 800, crop: "limit", quality: "auto" },
    ],
  } as any,
});

// ── Storage برای آواتار کاربر ───────────────────────────
const avatarStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "norontech/avatars",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    transformation: [
      { width: 200, height: 200, crop: "fill", quality: "auto" },
    ],
  } as any,
});

// ── Multer instances ────────────────────────────────────
export const uploadProductImages = multer({
  storage: productStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

export const uploadAvatar = multer({
  storage: avatarStorage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
});

export { cloudinary };
