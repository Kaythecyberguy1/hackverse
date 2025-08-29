// src/server.js
import express from "express";
import cors from "cors";

import authMiddleware from "./middleware/authMiddleware.js";
import apiRoutes from "./routes/api.js";
import authRoutes from "./routes/auth.js";

const app = express();
app.use(cors());
app.use(express.json());

// Public health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// Public auth routes
app.use("/api/auth", authRoutes);

// Protected routes
app.use("/api", authMiddleware, apiRoutes);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`🚀 Hackverse backend running on port ${PORT}`);
});
