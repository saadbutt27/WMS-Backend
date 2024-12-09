const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database'); // Import the sequelize instance

const Booking = sequelize.define("bookings", {
  order_ID: {
    type: DataTypes.STRING,
    allowNull: false, // Ensure it's required
    unique: true, // Unique order ID
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false, // Ensure it's required
  },
  booking_date: {
    type: DataTypes.DATE,
    allowNull: false, // Ensure it's required
  },
  pickup_location: {
    type: DataTypes.STRING,
    allowNull: false, // Ensure it's required
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false, // Ensure it's required
  }
}, {
  timestamps: true, // Automatically adds createdAt and updatedAt fields
  tableName: 'bookings', // Explicitly set the correct table name
});

module.exports = Booking;
