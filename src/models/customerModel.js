const { DataTypes } = require('sequelize');
const {sequelize} = require('../config/database');

const Customer = sequelize.define('Customer', {
  customer_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  username: { type: DataTypes.STRING, allowNull: false },
}, { tableName: 'customers', timestamps: false });

module.exports = Customer;
