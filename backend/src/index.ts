import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";
import categoryRoutes from "./routes/categoryRoutes";
import productRoutes from "./routes/productRoutes";
import orderRoutes from "./routes/orderRoutes";
import paymentRoutes from "./routes/paymentRoutes";
import aboutRoutes from "./routes/aboutRoutes";
import teamRoutes from "./routes/teamRoutes";
import faqRoutes from "./routes/faqRoutes";
import statsRoutes from "./routes/statsRoutes";
import messageRoutes from "./routes/messageRoutes";
import sliderRoutes from "./routes/sliderRoutes";

const app = express();
const PORT = process.env.PORT || 5001;

// ✅ Middleware
app.use("/uploads", express.static("uploads"));
app.use(
  cors({
    origin: (origin, callback) => {
      const allowedOrigins = [
        "http://localhost:3000",
        process.env.FRONTEND_URL,
      ].filter(Boolean); // ✅ حذف مقدارهای undefined

      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  }),
);
app.use(express.json());

// ✅ مسیرهای API
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/about", aboutRoutes);
app.use("/api/team", teamRoutes);
app.use("/api/faq", faqRoutes);
app.use("/api/stats", statsRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/sliders", sliderRoutes);

// ✅ اتصال به MongoDB Atlas
const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/ecommerce";

mongoose
  .connect(MONGODB_URI)
  .then(async () => {
    console.log("✅ Connected to MongoDB Atlas");

    // ✅ لود کردن مدل‌ها بعد از اتصال موفق
    await import("./models/Product");
    await import("./models/Category");
    await import("./models/User");
    console.log("📦 Models loaded successfully");
  })
  .catch((err) => {
    console.error("❌ MongoDB Connection error:", err);
    process.exit(1); // ❌ اگه وصل نشد، برنامه رو متوقف کن
  });

// ✅ Route تست
app.get("/", (req, res) => {
  res.json({
    message: "Backend is running....",
    status: "healthy",
    timestamp: new Date().toISOString(),
  });
});

// ✅ شروع سرور
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

// ✅ مدیریت خطاهای unexpected
process.on("unhandledRejection", (err) => {
  console.error("❌ Unhandled Rejection:", err);
  process.exit(1);
});
