const express = require("express");

const router = express.Router();

const userRouter = require("../domains/user");
const forgotPasswordRouter = require("../domains/forgot_password");
const otpRouter = require("../domains/otp-verification");
const mailingListRouter = require("../domains/mailing_list");
const contactOurSupportRouter = require("../domains/contact_our_support");

router.use("/api/v1", userRouter);
router.use("/api/v1", forgotPasswordRouter);
router.use("/api/v1", otpRouter);
router.use("/api/v1", mailingListRouter);
router.use("/api/v1", contactOurSupportRouter);

module.exports = router;
