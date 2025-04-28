// Sequelize Models
const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

// Admins

const Auditlog = sequelize.define(
  "Auditlog",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    table_name: {
      type: DataTypes.STRING(100),
    },
    operation_type: {
      type: DataTypes.STRING(10),
    },
    primary_key_value: {
      type: DataTypes.STRING(100),
    },
    changed_data: {
      type: DataTypes.TEXT,
    },
    changed_by: {
      type: DataTypes.STRING(100),
    },
    changed_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    timestamps: false, // Automatically adds createdAt and updatedAt fields
    tableName: "audit_log", // Explicitly set the correct table name
  }
);

module.exports = Auditlog;
