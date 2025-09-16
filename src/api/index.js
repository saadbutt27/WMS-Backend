const app = require("../app");
const serverless = require("serverless-http");

// Export your app as a handler for Vercel
module.exports = serverless(app);
