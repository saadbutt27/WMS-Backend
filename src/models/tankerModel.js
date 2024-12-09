const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database'); // Import the sequelize instance

const Tanker = sequelize.define("tankers", {
  plate_no: {
    type: DataTypes.STRING,
    allowNull: false, // Do not allow null
    unique: true
  },
  availability: {
    type: DataTypes.STRING,
    allowNull: false // Do not allow null
  },
  tanker_model: {
    type: DataTypes.STRING,
    allowNull: false // Do not allow null
  },
  capacity: {
    type: DataTypes.STRING,
    allowNull: false // Do not allow null
  }
}, {
  timestamps: true, // Automatically adds createdAt and updatedAt fields
});

module.exports = Tanker;
