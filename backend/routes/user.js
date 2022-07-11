const express = require("express");
const router = express.Router();

const userCtrl = require("../controllers/user");
const validatePassword = require("../middlewares/validate-password");
const validateEmail = require("../middlewares/validate-email");

router.post("/signup", validateEmail, validatePassword, userCtrl.signup);
router.post("/login", userCtrl.login);

module.exports = router;