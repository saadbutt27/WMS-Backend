const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database'); // Import the sequelize instance

const ConfirmedBooking = sequelize.define('ConfirmedBooking', {
  booking_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true,
  },
  customer_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  tanker_type: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  time: {
    type: DataTypes.TIME,
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'Confirmed',
  }
}, {
  timestamps: true, // Automatically adds createdAt and updatedAt fields
  tableName: 'ConfirmedBookings', // Ensure this matches the exact table name in the database
});

module.exports = ConfirmedBooking;
