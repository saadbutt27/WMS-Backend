// Sequelize Model for Complains
const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const Complain = sequelize.define(
  "Complain",
  {
    complain_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    complain_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    complain_description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING(50),
      defaultValue: "Pending",
      validate: {
        isIn: [["Pending", "Resolved"]],
      },
    },
    remarks: {
      type: DataTypes.TEXT,
    },
    customer_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    admin_id: {
      type: DataTypes.INTEGER,
    },
  },
  {
    timestamps: false,
    tableName: "complains",
  }
);

module.exports = Complain;
