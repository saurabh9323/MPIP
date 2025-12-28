const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const authRoutes = require("./modules/auth/auth.routes");
const userRoutes = require("./modules/user/user.routes");
const errorHandler = require("./middlewares/error.middleware");
const app = express();

app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());

// Auth routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);

app.use(errorHandler);

module.exports = app;
