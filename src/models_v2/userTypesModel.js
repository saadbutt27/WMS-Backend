// Sequelize Models
const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

// UserTypes

const UserTypes = sequelize.define(
  "UserTypes",
  {
    user_type_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    type: {
      type: DataTypes.STRING(2),
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
  },
  {
    timestamps: false, // Automatically adds createdAt and updatedAt fields
    tableName: "user_types", // Explicitly set the correct table name
  }
);

module.exports = UserTypes;
