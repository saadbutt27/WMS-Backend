const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const TankerPhaseRelation = sequelize.define(
  "TankerPhaseRelation",
  {
    tanker_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    phase_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    timestamps: false,
    tableName: "tanker_phase_relation",
  }
);

// Define Associations
// CustomerNotification.belongsTo(Customer, { foreignKey: "customer_id" });
// CustomerNotification.belongsTo(Notification, { foreignKey: "notification_id" });

module.exports = TankerPhaseRelation;
