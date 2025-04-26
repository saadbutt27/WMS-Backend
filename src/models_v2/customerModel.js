// Sequelize Models
const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

// Customers

const Customer = sequelize.define(
  "Customer",
  {
    customer_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    full_name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
    phone_number: {
      type: DataTypes.STRING(15),
      allowNull: false,
    },
    street_address: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    phase_number: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    balance: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    user_type_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    category: {
      type: DataTypes.STRING(30),
      allowNull: false,
      defaultValue: "Corporate",
      validate: {
        isIn: [["Corporate", "Civil", "DHA Employee"]],
      },
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    timestamps: false, // Automatically adds createdAt and updatedAt fields
    tableName: "customers", // Explicitly set the correct table name
  }
);
// Customer.associate = models => {
//     Customer.hasMany(models.Request, {
//         foreignKey: 'customer_id',
//         as: 'Requests'
//     });
//     Customer.hasMany(models.WaterTank, {
//         foreignKey: 'customer_id',
//     });
// };

module.exports = Customer;
