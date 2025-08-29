import express from "express";
import { exec } from "child_process";

const router = express.Router();
const labs = [
  { name: "dvwa", description: "Damn Vulnerable Web App" },
  { name: "bwapp", description: "Buggy Web App" },
  { name: "juice-shop", description: "OWASP Juice Shop" }
];

// GET all labs
router.get("/", (req, res) => {
  res.json(labs);
});


// Start lab (Docker run)
router.post("/start/:name", (req, res) => {
  const { name } = req.params;

  // Map each lab to a docker run command
  let command;
  if (name === "dvwa") {
    command = "docker run -d -p 8081:80 vulnerables/web-dvwa";
  } else if (name === "bwapp") {
    command = "docker run -d -p 8082:80 raesene/bwapp";
  } else {
    return res.status(404).json({ error: "Lab not found" });
  }

  exec(command, (err, stdout) => {
    if (err) return res.status(500).json({ error: "Failed to start lab" });

    const containerId = stdout.trim();
    let url = "";
    if (name === "dvwa") url = "http://localhost:8081";
    if (name === "bwapp") url = "http://localhost:8082";

    res.json({ containerId, url });
  });
});

// Flag submission
router.post("/submit/:name", (req, res) => {
  const { name } = req.params;
  const { flag } = req.body;

  // Example flags (store securely in DB later)
  const correctFlags = {
    dvwa: "flag{pwned_dvwa}",
    bwapp: "flag{got_bwapp}",
  };

  if (flag === correctFlags[name]) {
    res.json({ success: true, message: "Correct flag!" });
  } else {
    res.json({ success: false, message: "Wrong flag, try again." });
  }
});

export default router;
