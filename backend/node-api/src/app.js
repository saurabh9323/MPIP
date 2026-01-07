const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const morgan = require("morgan");
const authRoutes = require("./modules/auth/auth.routes");
const userRoutes = require("./modules/user/user.routes");
const errorHandler = require("./middlewares/error.middleware");
const app = express();

app.use(cookieParser());
// IMPORTANT: increase limit
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:3001","http://localhost:3002","http://localhost:3004"], // frontend URL
    credentials: true,
  })
);

app.use(helmet());
app.use(morgan("dev"));
// app.use(express.json());
app.use((req, res, next) => {
  console.log("NODE API HIT:", req.method, req.originalUrl);
  next();
});

// Auth routes
app.use("/auth", authRoutes);
app.use("/user", userRoutes);

app.use(errorHandler);

// ✅ Catch-all LAST
app.use((req, res) => {
  res.status(404).send("API is running....");
});


module.exports = app;
