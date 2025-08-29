import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// Example flag storage (later move to DB)
const validFlags = {
  "linux-intro": "flag{linux_intro_complete}",
  "web-basics": "flag{web_basics_done}",
  "crypto101": "flag{crypto101_mastered}"
};

// Submit flag
router.post("/submit", authMiddleware, (req, res) => {
  const { labId, flag } = req.body;

  if (!labId || !flag) {
    return res.status(400).json({ error: "Missing labId or flag" });
  }

  if (validFlags[labId] && validFlags[labId] === flag) {
    return res.json({ success: true, message: "Correct flag!" });
  }

  return res.status(400).json({ success: false, message: "Wrong flag!" });
});

export default router;
