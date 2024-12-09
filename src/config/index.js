// config/index.js

require("dotenv").config();

module.exports = {
  PORT: process.env.PORT || 5000,
  DB: {
    HOST: process.env.DB_HOST || "localhost",
    USER: process.env.DB_USER || "postgres",
    PASSWORD: process.env.DB_PASSWORD || "postgrespassword",
    NAME: process.env.DB_NAME || "myapp",
    PORT: process.env.DB_PORT || 5432,
  },
};
