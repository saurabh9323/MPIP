const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const app = express();

/* ================================
   CORS CONFIG
================================ */
const allowedOrigins = [
  "http://localhost:3000",
  "http://54.173.169.199",
  "http://saurabhpathak.duckdns.org",
  "http://saurabhpathak.duckdns.org:3000",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("CORS blocked: " + origin));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);


/* ================================
   🔥 GLOBAL OPTIONS HANDLER (FIX)
   ⚠️ DO NOT USE '*' OR '/*'
================================ */
app.use((req, res, next) => {
  if (req.method === "OPTIONS") {
    console.log("✅ OPTIONS handled by GATEWAY:", req.originalUrl);
    return res.sendStatus(204);
  }
  next();
});

/* ================================
   REQUEST LOGGER (DEBUG)
================================ */
app.use((req, res, next) => {
  console.log("🔥 GATEWAY HIT");
  console.log("METHOD:", req.method);
  console.log("URL:", req.originalUrl);
  console.log("ORIGIN:", req.headers.origin);
  next();
});

app.use(cookieParser());

/* ================================
   FASTAPI → /fast
================================ */
app.use(
  "/fast",
  createProxyMiddleware({
    target: "http://localhost:8001",
    changeOrigin: true,
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

