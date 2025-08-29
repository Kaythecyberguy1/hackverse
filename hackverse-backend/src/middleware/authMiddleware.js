// src/middleware/authMiddleware.js
export function authenticate(req, res, next) {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];
  if (token !== "hackverse-secret-token") {
    return res.status(403).json({ error: "Forbidden" });
  }

  next();
}
