const express = require("express");
const bookingController = require("../controllers/bookingController");
const { adminAuth } = require("../middlewares/authMiddleware");

const router = express.Router();

// Booking routes
router.post("/create-booking", bookingController.createBooking);
router.put("/reject-request/:id", bookingController.rejectRequest);
router.get("/all-bookings", bookingController.getAllBookings);
router.get("/single-booking/:id", bookingController.getBookingById);
router.put("/update-booking/:id", bookingController.updateBooking);
router.delete("/delete-booking/:id", bookingController.deleteBooking);
router.get("/my-bookings/:id", bookingController.getBookingForCustomer);
router.get("/my-bookings-report/:id", bookingController.getBookingReport);
////

router.get("/previous-requests", bookingController.previousBookings);

router.get("/request-status", bookingController.requestStatus);

router.delete("/cancel-request/:request_id", bookingController.cancelRequest);

router.get("/all-bills", bookingController.getAllBills);

router.post("/approve-request", bookingController.approveRequest);
// router.post("/approve-request", adminAuth, bookingController.approveRequest);

// Create a new booking request
router.post("/", bookingController.createBooking);

// Get all booking requests
router.get("/", bookingController.getAllBookings);

// Get drivers data for testing
router.get("/driver", bookingController.getDrivers);

// Get a single booking by order ID
router.get("/:id", bookingController.getBookingById);

// Update a booking by order ID
router.put("/:id", bookingController.updateBooking);

// Delete a booking by order ID
router.delete("/:id", bookingController.deleteBooking);

module.exports = router;
