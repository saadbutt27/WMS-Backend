const express = require('express');
const userRoutes = require('./userRoutes');
const tankerRoutes = require('./tankerRoutes');
const bookingRoutes = require('./bookingRoutes');
const confirmedBookingRoutes = require('./confirmedBookingRoutes'); // Import the confirmed booking routes

const router = express.Router();

// Use the routes
router.use('/users', userRoutes);
router.use('/tankers', tankerRoutes);
router.use('/bookings', bookingRoutes);
router.use('/confirmed-bookings', confirmedBookingRoutes); // Add the confirmed bookings route

module.exports = router;
