// Sequelize Models
const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

// Drivers

const Driver = sequelize.define(
  "Driver",
  {
    driver_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    full_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    phone_number: {
      type: DataTypes.STRING(15),
      allowNull: false,
      unique: true,
    },
    license_number: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    availability_status: {
      type: DataTypes.STRING(20),
      defaultValue: "Available",
      validate: {
        isIn: [["Available", "Unavailable"]],
      },
    },
    // assigned_tanker_id: {
    //   type: DataTypes.INTEGER,
    // },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },

    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    timestamps: false, // Automatically adds createdAt and updatedAt fields
    tableName: "drivers", // Explicitly set the correct table name
  }
);
// Driver.associate = models => {
//     Driver.belongsTo(models.Tanker, {
//         foreignKey: 'assigned_tanker_id',
//         as: 'AssignedTanker'
//     });
//     Driver.hasMany(models.DeliverySchedule, {
//         foreignKey: 'driver_id',
//         as: 'DeliverySchedules'
//     });
//     Driver.hasMany(models.TankerAssignment, {
//         foreignKey: 'driver_id',
//         as: 'Assignments'
//     });
// };

module.exports = Driver;
