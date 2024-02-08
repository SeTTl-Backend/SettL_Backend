const express = require("express");
const transactionRouter = express.Router();
const { VerifyTokenMW } = require("../../auth/tokenAuth");
const { createTransactionValidationMW } = require("./validators");
const transactionController = require("./controllers");

transactionRouter.post(
  "/create-transaction",
  VerifyTokenMW,
  createTransactionValidationMW,
  transactionController.createTransaction
);
