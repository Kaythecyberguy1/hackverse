import express from "express";
import fs from "fs";
import { exec } from "child_process";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();
const labsFile = new URL("../../labs.json", import.meta.url).pathname;

// Get all labs
router.get("/", authMiddleware, (req, res) => {
  const labs = JSON.parse(fs.readFileSync(labsFile));
  res.json(labs);
});

// Launch a lab (docker-compose up)
router.post("/launch/:labId", authMiddleware, (req, res) => {
  const { labId } = req.params;

  exec(`docker-compose up -d ${labId}`, (err, stdout, stderr) => {
    if (err) {
      return res.status(500).json({ error: `Failed to start lab: ${stderr}` });
    }
    res.json({ success: true, message: `Lab ${labId} started!` });
  });
});

// Stop a lab
router.post("/stop/:labId", authMiddleware, (req, res) => {
  const { labId } = req.params;

  exec(`docker-compose stop ${labId}`, (err, stdout, stderr) => {
    if (err) {
      return res.status(500).json({ error: `Failed to stop lab: ${stderr}` });
    }
    res.json({ success: true, message: `Lab ${labId} stopped!` });
  });
});

export default router;
