const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const app = express();

app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());

//sample and testing routes

app.get("/health", (req, res) => {
  res.json({ status: "OK", service: "Node API Gateway" });
});

module.exports = app;
