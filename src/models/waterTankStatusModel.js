const { DataTypes } = require('sequelize');
const {sequelize} = require('../config/database');

const WaterTankStatus = sequelize.define('WaterTankStatus', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  tank_id: { type: DataTypes.INTEGER, allowNull: false },
  water_level: { type: DataTypes.INTEGER, allowNull: false }, // Water level in liters
  status_date: { type: DataTypes.DATEONLY, allowNull: false },
  status_time: { type: DataTypes.TIME, allowNull: false },
}, { tableName: 'water_tank_status', timestamps: false });

module.exports = WaterTankStatus;
