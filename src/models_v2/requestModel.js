// Sequelize Models
const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

// Requests

const Request = sequelize.define(
  "Request",
  {
    request_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    customer_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    requested_liters: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    request_status: {
      type: DataTypes.STRING(20),
      defaultValue: "In Progress",
      validate: {
        isIn: [["In Progress", "Accepted", "Rejected"]],
      },
    },
    request_date: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    timestamps: false, // Automatically adds createdAt and updatedAt fields
    tableName: "requests", // Explicitly set the correct table name
  }
);
// Request.associate = models => {
//     Request.belongsTo(models.Customer, {
//         foreignKey: 'customer_id',
//         as: 'Customer'
//     });
//     Request.hasMany(models.DeliverySchedule, {
//         foreignKey: 'request_id',
//         as: 'DeliverySchedules'
//     });
//     Request.hasOne(models.Payment, {
//         foreignKey: 'request_id',
//         as: 'Payment'
//     });
// };

module.exports = Request;
