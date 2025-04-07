const express = require("express");
const userRoutes = require("./userRoutes");
const customerRoutes = require("./customerRoute");
const tankerRoutes = require("./tankerRoutes");
const bookingRoutes = require("./bookingRoutes");
const confirmedBookingRoutes = require("./confirmedBookingRoutes"); // Import the confirmed booking routes
const adminRoutes = require("./adminRoutes");
const superAdminRoutes = require("./superAdminRoutes");
const sensorRoutes = require("./sensorRoute");
const waterTankStatusRoutes = require("./watertankStatusRoutes");
const driverRoutes = require("./driverRoutes");
const notificationRoutes = require("./notificationRoutes");
const customerNotificationRoutes = require("./customerNotificationRoutes");

const router = express.Router();

// Use the routes
router.use("/users", userRoutes);
router.use("/customer", customerRoutes);
router.use("/tankers", tankerRoutes);
router.use("/bookings", bookingRoutes);
router.use("/confirmedbookings", confirmedBookingRoutes); // Add the confirmed bookings route
router.use("/admin", adminRoutes);
router.use("/superadmin", superAdminRoutes);
router.use("/sensor", sensorRoutes);
router.use("/tankStatus", waterTankStatusRoutes);
router.use("/driver", driverRoutes);
router.use("/notification", notificationRoutes);
router.use("/customerNotification", customerNotificationRoutes);

module.exports = router;
