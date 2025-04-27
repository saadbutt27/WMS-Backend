// Sequelize Models
const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

// Tankers

const Tanker = sequelize.define(
  "Tanker",
  {
    tanker_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    tanker_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    capacity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    availability_status: {
      type: DataTypes.STRING(20),
      defaultValue: "Available",
      validate: {
        isIn: [["Available", "Unavailable"]],
      },
    },
    plate_number:{
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true,
    },
    price_per_liter: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    cost: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    assigned_driver_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    timestamps: false, // Automatically adds createdAt and updatedAt fields
    tableName: "tankers", // Explicitly set the correct table name
  }
);
// Tanker.associate = models => {
//     Tanker.hasMany(models.Driver, {
//         foreignKey: 'assigned_tanker_id',
//         as: 'Drivers'
//     });
//     Tanker.hasMany(models.TankerAssignment, {
//         foreignKey: 'tanker_id',
//         as: 'Assignments'
//     });
//     Tanker.hasMany(models.DeliverySchedule, {
//         foreignKey: 'tanker_id',
//         as: 'DeliverySchedules'
//     });
// };

module.exports = Tanker;
