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

import "./models/Product";
import "./models/Category";
import "./models/User";

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use("/uploads", express.static("uploads"));
app.use(cors());
app.use(express.json());

// ✅ مسیرهای API — بدون route تست
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
// Connect MongoDB
const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/ecommerce";

mongoose
  .connect(MONGODB_URI)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB Connection error:", err));

app.get("/", (req, res) => {
  res.send("Backend is running....");
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
