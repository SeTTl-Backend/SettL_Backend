const express = require("express");
const emailVerificationController = require("./controllers");

const emailVerificationRouter = express.Router();

// verify email
emailVerificationRouter.get(
  "/:userId/:uniqueString",
  emailVerificationController.userVerification
);

module.exports = emailVerificationRouter;
