const Booking = require("../models/bookingModel");

// Create a new booking request
exports.createBooking = async (req, res) => {
  try {
    const { order_ID, username, booking_date, pickup_location, status } = req.body;
    const newBooking = await Booking.create({ order_ID, username, booking_date, pickup_location, status });
    res.status(201).json(newBooking);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all booking requests
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.findAll();
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single booking by order ID
exports.getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findByPk(req.params.id);
    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }
    res.status(200).json(booking);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a booking by order ID
exports.updateBooking = async (req, res) => {
  try {
    const { order_ID, username, booking_date, pickup_location, status } = req.body;
    const booking = await Booking.findByPk(req.params.id);
    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }
    await booking.update({ order_ID, username, booking_date, pickup_location, status });
    res.status(200).json(booking);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a booking by order ID
exports.deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findByPk(req.params.id);
    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }
    await booking.destroy();
    res.status(200).json({ message: "Booking deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
