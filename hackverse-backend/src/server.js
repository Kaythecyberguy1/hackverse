// src/server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { authenticate } from "./middleware/authMiddleware.js";
import { labs } from "./labs.js";
import labsRouter from "./routes/labs.js";


dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;
app.use("/api/labs", labsRouter);

app.use(cors());
app.use(express.json());

// --- Routes ---
app.get("/", (req, res) => {
  res.send("🚀 Hackverse Backend Running");
});

// Get labs
app.get("/api/labs", authenticate, (req, res) => {
  res.json(labs);
});

// Start a lab
app.post("/api/labs/start/:name", authenticate, (req, res) => {
  const { name } = req.params;
  const lab = labs.find((l) => l.name === name);

  if (!lab) {
    return res.status(404).json({ error: "Lab not found" });
  }

  // Right now just return a placeholder URL
  return res.json({
    message: `Lab ${name} started`,
    url: `http://localhost:${lab.port}`,
  });
});

// --- Server listen ---
app.listen(PORT, () => {
  console.log(`🚀 Hackverse backend running on port ${PORT}`);
});
