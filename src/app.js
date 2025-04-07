const express = require("express");
const cors = require("cors");
const routes = require("./routes");
const { connectDB } = require("./config/database");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(cookieParser());

// health check api
app.get("/", (req, res) => {
  res.status(200).send({ message: "Server is running. Welcome to WMS API." });
});

app.use("/api", routes);

connectDB();

module.exports = app;
