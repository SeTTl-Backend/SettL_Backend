const express = require("express");
const { RequestPasswordResetMW, PasswordResetMW } = require("./validators");
const ForgotPasswordRouter = express.Router();

const forgotPasswordController = require("./controllers");

ForgotPasswordRouter.post(
  "/request-password-reset",
  RequestPasswordResetMW,
  forgotPasswordController.requestPasswordReset
);
ForgotPasswordRouter.post(
  "/password-reset",
  PasswordResetMW,
  forgotPasswordController.passwordReset
);

module.exports = ForgotPasswordRouter;
