const express = require("express");
const otpController = require("./controllers");
const { OtpValidationMW } = require("./validators");

const otpRouter = express.Router();

// send otp
otpRouter.post("/send-otp", OtpValidationMW, otpController.sendOtp);

module.exports = otpRouter;
