const express = require("express");
const userRouter = express.Router();
const { VerifyTokenMW } = require("../../auth/tokenAuth");
const {
  RegisterUserValidationMW,
  AuthenticateUserValidationMW,
  UpdateUserProfileValidationMW,
} = require("./validators");
const userController = require("./controllers");

userRouter.get("/users", VerifyTokenMW, userController.getAllUsers);
userRouter.get(
  "/getUserById/:userId",
  VerifyTokenMW,
  userController.getUserById
);
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
userRouter.post(
  "/update-user-profile",
  UpdateUserProfileValidationMW,
  userController.updateUserProfile
);

module.exports = userRouter;
