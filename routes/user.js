const express = require("express");
const userCtrl = require("../controllers/user");
const loginLimiter = require("../middleware/rateLimite");

const router = express.Router();

router.post("/signup", loginLimiter, userCtrl.signup);
router.post("/login", userCtrl.login);

module.exports = router;
