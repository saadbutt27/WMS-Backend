const ConfirmedBooking = require('../models/confirmedBookingModel'); // Import the ConfirmedBooking model

// Create a new confirmed booking
exports.createConfirmedBooking = async (req, res) => {
  try {
    const { booking_id, customer_name, tanker_type, date, time, status } = req.body;

    // Create the confirmed booking
    const newConfirmedBooking = await ConfirmedBooking.create({
      booking_id,
      customer_name,
      tanker_type,
      date,
      time,
      status: status || 'Confirmed', // Default status is "Confirmed"
    });

    res.status(201).json(newConfirmedBooking);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all confirmed bookings
exports.getAllConfirmedBookings = async (req, res) => {
  try {
    const confirmedBookings = await ConfirmedBooking.findAll();
    res.status(200).json(confirmedBookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single confirmed booking by ID
exports.getConfirmedBookingById = async (req, res) => {
  try {
    const confirmedBooking = await ConfirmedBooking.findByPk(req.params.id);
    if (!confirmedBooking) {
      return res.status(404).json({ error: "Confirmed booking not found" });
    }
    res.status(200).json(confirmedBooking);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a confirmed booking by ID
exports.updateConfirmedBooking = async (req, res) => {
  try {
    const { customer_name, tanker_type, date, time, status } = req.body;
    const confirmedBooking = await ConfirmedBooking.findByPk(req.params.id);
    if (!confirmedBooking) {
      return res.status(404).json({ error: "Confirmed booking not found" });
    }

    // Update the booking
    await confirmedBooking.update({
      customer_name,
      tanker_type,
      date,
      time,
      status
    });

    res.status(200).json(confirmedBooking);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a confirmed booking by ID
exports.deleteConfirmedBooking = async (req, res) => {
  try {
    const confirmedBooking = await ConfirmedBooking.findByPk(req.params.id);
    if (!confirmedBooking) {
      return res.status(404).json({ error: "Confirmed booking not found" });
    }

    // Delete the booking
    await confirmedBooking.destroy();
    res.status(200).json({ message: "Confirmed booking deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
