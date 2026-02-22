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

// ✅ CORS — همه origin های Vercel رو قبول میکنه
app.use(
  cors({
    origin: (origin, callback) => {
      // اگه origin نداشت (مثل Postman) یا localhost بود قبول کن
      if (!origin) return callback(null, true);

      const allowedOrigins = [
        "http://localhost:3000",
        process.env.FRONTEND_URL,
      ].filter(Boolean) as string[];

      // ✅ همه subdomain های Vercel رو قبول کن
      const isVercel = origin.endsWith(".vercel.app");
      const isAllowed = allowedOrigins.includes(origin);

      if (isVercel || isAllowed) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(express.json());

// ── Routes ───────────────────────────────────────────────
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
app.use(cors({ origin: "*", credentials: false }));
// ── Health check ─────────────────────────────────────────
app.get("/", (req, res) => {
  res.json({
    message: "NoronTech Backend ✅",
    timestamp: new Date().toISOString(),
  });
});

// ── MongoDB ──────────────────────────────────────────────
const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/ecommerce";

mongoose
  .connect(MONGODB_URI)
  .then(async () => {
    console.log("✅ Connected to MongoDB");
    await import("./models/Product");
    await import("./models/Category");
    await import("./models/User");
  })
  .catch((err) => {
    console.error("❌ MongoDB Connection error:", err);
    process.exit(1);
  });

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

process.on("unhandledRejection", (err) => {
  console.error("❌ Unhandled Rejection:", err);
  process.exit(1);
});
