const { Sequelize } = require('sequelize');
const path = process.env.NODE_ENV === "production"
  ? ".env.production.local"
  : ".env.development.local";

require("dotenv").config({ path });


// const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
//   host: process.env.DB_HOST,
//   dialect: 'postgres',
// });

// Get POSTGRES envs
const POSTGRES_URL = process.env.POSTGRES_NEON_URL;

const sequelize = new Sequelize(POSTGRES_URL, {
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: true, // Ensures SSL connection
      rejectUnauthorized: false, // Allows self-signed certificates (if necessary)
    },
  },
});

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connected to the database.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

module.exports = { sequelize, connectDB };
