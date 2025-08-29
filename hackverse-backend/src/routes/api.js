// src/routes/api.js
import { Router } from "express";

const router = Router();

router.get("/labs", (req, res) => {
  res.json([
    { id: 1, name: "linux-intro", status: "ready" },
    { id: 2, name: "web-basics", status: "ready" },
    { id: 3, name: "crypto101", status: "ready" },
  ]);
});

export default router;
