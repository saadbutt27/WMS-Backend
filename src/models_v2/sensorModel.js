// Sequelize Models
const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

// Sensors

const Sensor = sequelize.define(
  "Sensor",
  {
    sensor_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    sensor_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    sensor_details: {
      type: DataTypes.TEXT,
    },
    manufacturing_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING(20),
      defaultValue: "Not Assigned",
      validate: {
        isIn: [["Not Assigned", "Assigned"]],
      },
    },
  },
  {
    timestamps: false, // Automatically adds createdAt and updatedAt fields
    tableName: "sensors", // Explicitly set the correct table name
  }
);
// Sensor.associate = models => {
//     Sensor.hasOne(models.WaterTank, {
//         foreignKey: 'sensor_id',
//         as: 'WaterTank'
//     });
// };

module.exports = Sensor;
