// Sequelize Models
const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

// WaterTanks
const WaterTank = sequelize.define(
  "WaterTank",
  {
    tank_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    customer_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    sensor_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    capacity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    timestamps: false, // Automatically adds createdAt and updatedAt fields
    tableName: "water_tanks", // Explicitly set the correct table name
  }
);

// WaterTank.associate = (models) => {
//   // WaterTank.belongsTo(models.Customer, {
//   //   foreignKey: "customer_id",
//   //   as: "Customer",
//   // });
//   // WaterTank.belongsTo(models.Sensor, {
//   //   foreignKey: "sensor_id",
//   //   as: "Sensor",
//   // });
//   // WaterTank.hasMany(models.WaterTankStatus, {
//   //   as: "Statuses",
//   // });

// };

module.exports = WaterTank;
