import express from "express";
import cors from "cors";
import { startLab, stopLab, listInstances } from "./docker.js";
import labs from "./labs.json" assert { type: "json" };

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Hackverse Backend Running 🚀" });
});

// Get all labs
app.get("/api/labs", (req, res) => {
  res.json(labs);
});

// Start a lab (launch Docker)
app.post("/api/labs/:slug/start", async (req, res) => {
  const lab = labs.find((l) => l.slug === req.params.slug);
  if (!lab) return res.status(404).json({ error: "Lab not found" });

  try {
    const result = await startLab(lab);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to start lab" });
  }
});

// Stop a lab
app.post("/api/labs/:slug/stop", async (req, res) => {
  try {
    const result = await stopLab(req.params.slug);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: "Failed to stop lab" });
  }
});

// List running instances
app.get("/api/instances", (req, res) => {
  res.json(listInstances());
});

const PORT = 5000;
app.listen(PORT, () => console.log(`✅ Backend running on http://localhost:${PORT}`));
