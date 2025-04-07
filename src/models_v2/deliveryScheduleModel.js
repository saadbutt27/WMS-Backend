// Sequelize Models
const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

// DeliverySchedules

const DeliverySchedule = sequelize.define(
  "DeliverySchedule",
  {
    schedule_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    request_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
    tanker_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    driver_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    scheduled_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    delivery_status: {
      type: DataTypes.STRING(20),
      defaultValue: "Scheduled",
      validate: {
        isIn: [["Scheduled", "In Progress", "Completed", "Cancelled"]],
      },
    },
  },
  {
    timestamps: false, // Automatically adds createdAt and updatedAt fields
    tableName: "deliveryschedule", // Explicitly set the correct table name
  }
);
// DeliverySchedule.associate = models => {
//     DeliverySchedule.belongsTo(models.Request, {
//         foreignKey: 'request_id',
//         as: 'Request'
//     });
//     DeliverySchedule.belongsTo(models.Tanker, {
//         foreignKey: 'tanker_id',
//         as: 'Tanker'
//     });
//     DeliverySchedule.belongsTo(models.Driver, {
//         foreignKey: 'driver_id',
//         as: 'Driver'
//     });
// };

module.exports = DeliverySchedule;
