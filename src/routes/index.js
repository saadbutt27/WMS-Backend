const express = require("express");
const userRoutes = require("./userRoutes");
const tankerRoutes = require("./tankerRoutes");

const router = express.Router();

router.use("/users", userRoutes);
router.use("/tankers", tankerRoutes);

module.exports = router;
