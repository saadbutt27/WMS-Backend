const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const ConfirmedBooking = sequelize.define("confirmedbookings", {
  order_ID: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  booking_date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  pickup_location: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  timestamps: true,
  tableName: 'confirmedbookings',
});

module.exports = ConfirmedBooking;
