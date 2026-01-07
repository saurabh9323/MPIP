const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:3001",
      "http://localhost:3002",
      "http://localhost:3004",
    ],
    credentials: true,
  })
);

app.use(cookieParser());

// 🔥 1️⃣ FastAPI FIRST (more specific)
app.use(
  "/fast",
  createProxyMiddleware({
    target: "http://localhost:8001",
    changeOrigin: true,

    // 🔥 REMOVE CORS HEADERS COMING FROM FASTAPI
    onProxyRes(proxyRes, req, res) {
      delete proxyRes.headers["access-control-allow-origin"];
      delete proxyRes.headers["access-control-allow-credentials"];
      delete proxyRes.headers["access-control-allow-methods"];
      delete proxyRes.headers["access-control-allow-headers"];
    },
  })
);


// 🔥 2️⃣ EVERYTHING ELSE UNDER /api → Node API
app.use(
  "/api",
  createProxyMiddleware({
    target: "http://localhost:5000",
    changeOrigin: true,
  })
);

// Health check
app.get("/health", (req, res) => {
  res.send("Gateway is running");
});

app.listen(4000, () => {
  console.log("🚀 Gateway running on http://localhost:4000");
});
