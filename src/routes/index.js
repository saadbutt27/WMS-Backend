const express = require("express");
const userRoutes = require("./userRoutes");
const tankerRoutes = require("./tankerRoutes");
const bookingRoutes = require("./bookingRoutes");

const router = express.Router();

router.use("/users", userRoutes);
router.use("/tankers", tankerRoutes);
router.use("/bookings", bookingRoutes); // Add the booking routes

module.exports = router;
