const { DataTypes } = require('sequelize');
const {sequelize} = require('../config/database');

const Request = sequelize.define('Request', {
  request_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  customer_id: { type: DataTypes.INTEGER, allowNull: false },
  requested_liters: { type: DataTypes.INTEGER, allowNull: false },
  request_date: { type: DataTypes.DATE, allowNull: false },
}, { tableName: 'requests', timestamps: false });

module.exports = Request;
