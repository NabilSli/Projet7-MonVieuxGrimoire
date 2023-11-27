const dotenv = require("dotenv").config();

module.exports = {
  endpoint: process.env.API_URL,
  masterKey: process.env.API_KEY,
};
