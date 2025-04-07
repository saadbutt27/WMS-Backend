const ConfirmedBooking = require("../models/confirmedBookingModel");

// Create a new confirmed booking
exports.createConfirmedBooking = async (req, res) => {
  try {
    const { order_ID, username, booking_date, pickup_location, status } = req.body;
    const newBooking = await ConfirmedBooking.create({ order_ID, username, booking_date, pickup_location, status });
    res.status(201).json(newBooking);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all confirmed bookings
exports.getAllConfirmedBookings = async (req, res) => {
  try {
    const bookings = await ConfirmedBooking.findAll();
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single confirmed booking by order ID
exports.getConfirmedBookingById = async (req, res) => {
  try {
    const booking = await ConfirmedBooking.findByPk(req.params.id);
    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }
    res.status(200).json(booking);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a confirmed booking by order ID
exports.updateConfirmedBooking = async (req, res) => {
  try {
    const { order_ID, username, booking_date, pickup_location, status } = req.body;
    const booking = await ConfirmedBooking.findByPk(req.params.id);
    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }
    await booking.update({ order_ID, username, booking_date, pickup_location, status });
    res.status(200).json(booking);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a confirmed booking by order ID
exports.deleteConfirmedBooking = async (req, res) => {
  try {
    const booking = await ConfirmedBooking.findByPk(req.params.id);
    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }
    await booking.destroy();
    res.status(200).json({ message: "Booking deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
