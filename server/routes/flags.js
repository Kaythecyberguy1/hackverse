import express from "express";

const router = express.Router();

// hardcoded flag map (later you can store in DB)
const flags = {
  "linux-intro": "hv{n1x101}",
  "web-basics": "hv{w3b01}",
};

router.post("/submit-flag", (req, res) => {
  const { slug, flag } = req.body;
  if (!slug || !flag) return res.status(400).json({ message: "Missing fields" });

  if (flags[slug] && flags[slug] === flag.trim()) {
    return res.json({ message: "✅ Correct flag! Well done." });
  }
  return res.status(400).json({ message: "❌ Wrong flag, try again." });
});

export default router;
