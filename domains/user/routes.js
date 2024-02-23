const express = require("express");
const userRouter = express.Router();
const { VerifyTokenMW } = require("../../auth/tokenAuth");
const {
  RegisterUserValidationMW,
  AuthenticateUserValidationMW,
  UpdateUserProfileValidationMW,
  UpdateUserAccountDetailsValidationMW,
  UpdateUserContactDetailsValidationMW,
  UpdateUserKycDetailsValidationMW,
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
  "/update-user-account-details",
  UpdateUserAccountDetailsValidationMW,
  userController.updateUserAccountDetails
);

userRouter.patch(
  "/update-user-contact-details",
  UpdateUserContactDetailsValidationMW,
  userController.updateUserContactDetails
);

userRouter.patch(
  "/update-user-kyc-details",
  UpdateUserKycDetailsValidationMW,
  userController.updateUserKycDetails
);

module.exports = userRouter;
