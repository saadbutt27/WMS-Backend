// Sequelize Models
const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

// Phase

const Phase = sequelize.define(
  "Phase",
  {
    phase_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    phase_name: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    timestamps: false, // Automatically adds createdAt and updatedAt fields
    tableName: "phase", // Explicitly set the correct table name
  }
);

module.exports = Phase;
