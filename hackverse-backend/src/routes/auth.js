// src/routes/auth.js
import { Router } from "express";

const router = Router();

// Mock login route
router.post("/login", (req, res) => {
  const { username, password } = req.body;

  // ⚠️ Replace this with real user auth later
  if (username === "admin" && password === "hackverse") {
    return res.json({ token: "hackverse-secret-token" });
  }

  res.status(401).json({ error: "Invalid credentials" });
});

export default router;
