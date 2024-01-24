const express = require("express");
const userRouter = express.Router();
const {
  RegisterUserValidationMW,
  AuthenticateUserValidationMW,
} = require("./validators");
const userController = require("./controllers");

userRouter.get("/", userController.getAllUsers);
userRouter.post(
  "/register",
  RegisterUserValidationMW,
  userController.registerUser
);
userRouter.post(
  "/signin",
  AuthenticateUserValidationMW,
  userController.authenticateUser
);

module.exports = userRouter;
