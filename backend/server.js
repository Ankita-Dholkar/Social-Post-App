const express = require("express");
const dotenv = require("dotenv");

// Load environment variables FIRST
dotenv.config();

const cors = require("cors");
const morgan = require("morgan");
const path = require("path");

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const postRoutes = require("./routes/postRoutes");

// Connect to MongoDB Atlas
connectDB();

const app = express();

// ─── Middleware ─────────────────────────────────
// CORS — allow requests from the React frontend
const allowedOrigins = [
  process.env.CLIENT_URL || "http://localhost:5173",
  "http://localhost:5173",
  "http://localhost:5174",
];
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// Parse incoming JSON and URL-encoded requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// HTTP request logger (dev mode only)
if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

// ─── API Routes ──────────────────────────────────
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);

// ─── Health Check Route ──────────────────────────
app.get("/", (req, res) => {
  res.json({ message: "🚀 Social Post App API is running!" });
});

// ─── 404 Handler ────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// ─── Global Error Handler ─────────────────────────
app.use((err, req, res, next) => {
  console.error("Global Error:", err?.stack || err?.message || err);
  const statusCode = err?.statusCode || 500;
  res.status(statusCode).json({
    message: err?.message || "Internal Server Error",
  });
});

// ─── Start Server ────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

// Export the Express API for Vercel Serverless Functions
module.exports = app;
