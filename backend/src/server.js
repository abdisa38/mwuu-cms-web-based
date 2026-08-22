import dns from "dns";
// Set Google DNS for Windows SRV Mongo Atlas support
try {
  dns.setServers(["8.8.8.8", "8.8.4.4", "1.1.1.1"]);
} catch (e) {
  console.warn("DNS warning:", e.message);
}

import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { connectDB } from "./config/db.js";
import { seedDatabase } from "./seed/seed.js";

import authRoutes from "./routes/authRoutes.js";
import clearanceRoutes from "./routes/clearanceRoutes.js";
import officerRoutes from "./routes/officerRoutes.js";
import registrarRoutes from "./routes/registrarRoutes.js";
import publicRoutes from "./routes/publicRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, "../.env") });

const app = express();

// Connect to Database & auto-seed if needed
connectDB().then(() => {
  seedDatabase();
});

// Middleware
app.use(
  cors({
    origin: "*", // allow all origins during development
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// Health Check
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    service: "MWU Clearance Management System Backend",
    timestamp: new Date(),
  });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/clearances", clearanceRoutes);
app.use("/api/officer", officerRoutes);
app.use("/api/registrar", registrarRoutes);
app.use("/api/public", publicRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/messages", messageRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route not found: ${req.originalUrl}` });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("Server Error:", err);
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`[SERVER] MWU CMS Backend Server running on port ${PORT}`);
  console.log(`[ENVIRONMENT] ${process.env.NODE_ENV || "development"}`);
});
