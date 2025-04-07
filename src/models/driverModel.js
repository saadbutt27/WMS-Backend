const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');



const Driver = sequelize.define('Driver', {
    driver_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    full_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phone_number: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    license_number: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    availability_status: {
      type: DataTypes.STRING,
      defaultValue: 'Available',
    },
    assigned_tanker_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  }, {
    tableName: 'drivers',
    timestamps: false,
  });
  
  module.exports = Driver;