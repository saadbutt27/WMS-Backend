// Sequelize Models
const { DataTypes, Sequelize } = require("sequelize");
const { sequelize } = require("../config/database");

// WaterTankStatuses
const WaterTankStatus = sequelize.define(
  "WaterTankStatus",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    tank_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    water_level: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: "active", // Default status
    },
    status_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal("CURRENT_DATE"), // PostgreSQL compatible default
    },
    status_time: {
      type: DataTypes.TIME,
      allowNull: false,
      defaultValue: Sequelize.literal("CURRENT_TIME"), // PostgreSQL compatible default
    },
  },
  {
    timestamps: false, // Automatically adds createdAt and updatedAt fields
    tableName: "water_tank_status", // Explicitly set the correct table name
  }
);

// WaterTankStatus.associate = models => {
//     WaterTankStatus.belongsTo(models.WaterTank, {
//         foreignKey: 'tank_id',
//         as: 'WaterTank'
//     });

module.exports = WaterTankStatus;
