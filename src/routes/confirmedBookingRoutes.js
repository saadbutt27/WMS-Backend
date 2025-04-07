const express = require("express");
const confirmedBookingController = require("../controllers/confirmedBookingController");

const router = express.Router();

// Create a new confirmed booking
router.post("/", confirmedBookingController.createConfirmedBooking);

// Get all confirmed bookings
router.get("/", confirmedBookingController.getAllConfirmedBookings);

// Get a single confirmed booking by order ID
router.get("/:id", confirmedBookingController.getConfirmedBookingById);

// Update a confirmed booking by order ID
router.put("/:id", confirmedBookingController.updateConfirmedBooking);

// Delete a confirmed booking by order ID
router.delete("/:id", confirmedBookingController.deleteConfirmedBooking);

module.exports = router;
