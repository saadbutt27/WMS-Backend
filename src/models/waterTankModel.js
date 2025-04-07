const { DataTypes } = require('sequelize');
const {sequelize} = require('../config/database');

const WaterTank = sequelize.define('WaterTank', {
  tank_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  customer_id: { type: DataTypes.INTEGER, allowNull: false },
  capacity: { type: DataTypes.INTEGER, allowNull: false },
}, { tableName: 'water_tanks', timestamps: false });

module.exports = WaterTank;
