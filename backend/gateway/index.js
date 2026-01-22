const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const app = express();

/* ================================
   CORS CONFIG
================================ */


app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:3001",
      "http://localhost:3002",
      "http://localhost:3004",
      "http://saurabhpathak.duckdns.org",
      "http://saurabhpathak.duckdns.org:3000",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);

app.use(cookieParser());

/* ================================
   FASTAPI → /fast
================================ */


app.use(
  "/fast",
  createProxyMiddleware({
    target: "http://localhost:8001",
    changeOrigin: true,
    pathRewrite: {
      "^/fast": "",
    },
    
  })
);
/* ================================
   NODE API → /api
================================ */
app.use(
  "/api",
  createProxyMiddleware({
    target: "http://localhost:5000",
    changeOrigin: true,
    pathRewrite: {
      "^/api": "",
    },
  })
);

/* ================================
   START SERVER
================================ */
app.listen(4000, () => {
  console.log("✅ Gateway running on port 4000");
});

