const rateLimit = require("express-rate-limit");

let watchTime = 30 * 60 * 1000; // 30 minutes

const loginLimiter = rateLimit({
  windowMs: watchTime,
  max: 10,
  message: "Trop de tentatives de connexion. Réessayez plus tard.",
});

module.exports = loginLimiter;
