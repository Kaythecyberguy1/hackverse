import express from "express";
import { exec } from "child_process";

const router = express.Router();

// Start lab
router.post("/start-lab", (req, res) => {
  exec("docker ps -q --filter name=hackverse-lab", (err, stdout) => {
    if (stdout.trim()) {
      return res.json({
        ip: "127.0.0.1",
        port: "2222",
        user: "root",
        password: "toor",
        time: 3600
      });
    }

    exec(
      "docker run -d --rm -p 2222:22 --name hackverse-lab hackverse/debian-lab",
      (err2, stdout2, stderr2) => {
        if (err2) {
          console.error(stderr2);
          return res.status(500).json({ error: "Failed to start lab" });
        }
        res.json({
          ip: "127.0.0.1",
          port: "2222",
          user: "root",
          password: "toor",
          time: 3600
        });
      }
    );
  });
});

// Stop lab
router.post("/stop-lab", (req, res) => {
  exec("docker rm -f hackverse-lab", (err, stdout, stderr) => {
    if (err) {
      console.error(stderr);
      return res.status(500).json({ error: "Failed to stop lab" });
    }
    res.json({ success: true });
  });
});

export default router;
