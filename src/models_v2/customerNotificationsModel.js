const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const CustomerNotification = sequelize.define(
  "CustomerNotification",
  {
    customer_notification_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    customer_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    notification_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    timestamps: false,
    tableName: "customer_notifications",
  }
);

// Define Associations
// CustomerNotification.belongsTo(Customer, { foreignKey: "customer_id" });
// CustomerNotification.belongsTo(Notification, { foreignKey: "notification_id" });

module.exports = CustomerNotification;
