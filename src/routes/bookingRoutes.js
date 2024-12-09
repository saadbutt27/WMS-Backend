const express = require("express");
const bookingController = require("../controllers/bookingController");

const router = express.Router();

// Create a new booking request
router.post("/", bookingController.createBooking);

// Get all booking requests
router.get("/", bookingController.getAllBookings);

// Get a single booking by order ID
router.get("/:id", bookingController.getBookingById);

// Update a booking by order ID
router.put("/:id", bookingController.updateBooking);

// Delete a booking by order ID
router.delete("/:id", bookingController.deleteBooking);

module.exports = router;
