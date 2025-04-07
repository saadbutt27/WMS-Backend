// Sequelize Models
const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

// TankerAssignments

const TankerAssignment = sequelize.define(
  "TankerAssignment",
  {
    assignment_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    tanker_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    driver_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    assignment_date: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    status: {
      type: DataTypes.STRING(20),
      defaultValue: "Active",
      validate: {
        isIn: [["Active", "Completed"]],
      },
    },
  },
  {
    timestamps: false, // Automatically adds createdAt and updatedAt fields
    tableName: "tankerassignments", // Explicitly set the correct table name
  }
);
// TankerAssignment.associate = models => {
//     TankerAssignment.belongsTo(models.Tanker, {
//         foreignKey: 'tanker_id',
//         as: 'Tanker'
//     });
//     TankerAssignment.belongsTo(models.Driver, {
//         foreignKey: 'driver_id',
//         as: 'Driver'
//     });
// };

module.exports = TankerAssignment;
