const express = require("express");
const userRouter = express.Router();
const { VerifyTokenMW } = require("../../auth/tokenAuth");
const {
  RegisterUserValidationMW,
  AuthenticateUserValidationMW,
  UpdateUserProfileValidationMW,
  UpdateUserAccountDetailsValidationMW,
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
userRouter.patch(
  "/update-user-profile",
  UpdateUserProfileValidationMW,
  userController.updateUserProfile
);

userRouter.patch(
  "/update-user-profile",
  UpdateUserAccountDetailsValidationMW,
  userController.updateUserAccountDetails
);

module.exports = userRouter;
