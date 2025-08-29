// src/config.js
import dotenv from "dotenv";
dotenv.config();

function parseRange(r) {
  const [a, b] = (r || "").split("-").map(Number);
  return Number.isFinite(a) && Number.isFinite(b) && a <= b ? [a, b] : [30000, 39999];
}

export const config = {
  port: parseInt(process.env.PORT || "8080", 10),
  publicHost: process.env.PUBLIC_HOST || "http://localhost",
  dockerSocket: process.env.DOCKER_SOCKET || "/var/run/docker.sock",
  dockerHost: process.env.DOCKER_HOST || null,
  defaultTtlMinutes: parseInt(process.env.DEFAULT_TTL_MINUTES || "60", 10),
  hostPortRange: parseRange(process.env.ALLOWED_HOST_PORT_RANGE),
  apiKey: process.env.API_KEY || null,
};
