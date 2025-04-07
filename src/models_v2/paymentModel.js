// Sequelize Models
const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

// Payments

const Payment = sequelize.define(
  "Payment",
  {
    payment_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    request_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    amount_paid: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    payment_status: {
      type: DataTypes.STRING(20),
      defaultValue: "Pending",
      validate: {
        isIn: [["Paid", "Pending"]],
      },
    },
    payment_date: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    timestamps: false, // Automatically adds createdAt and updatedAt fields
    tableName: "payments", // Explicitly set the correct table name
  }
);
// Payment.associate = models => {
//     Payment.belongsTo(models.Request, {
//         foreignKey: 'request_id',
//         as: 'Request'
//     });
// };

module.exports = Payment;
