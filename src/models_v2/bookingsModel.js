// Sequelize Models
const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

// Bookings

const Bookings = sequelize.define(
  "Bookings",
  {
    booking_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    admin_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    tanker_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    customer_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    request_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
    scheduled_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING(20),
      defaultValue: "Pending",
      validate: {
        isIn: [["Pending", "Delivered"]],
      },
    },
    booking_code: {
      type: DataTypes.CHAR(6),
      allowNull: false,
      unique: true,
    },
  },
  {
    timestamps: false, // Automatically adds createdAt and updatedAt fields
    tableName: "bookings", // Explicitly set the correct table name
  }
);

module.exports = Bookings;
