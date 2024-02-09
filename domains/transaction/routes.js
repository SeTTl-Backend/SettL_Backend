const express = require("express");
const transactionRouter = express.Router();
const { VerifyTokenMW } = require("../../auth/tokenAuth");
const {
  createTransactionValidationMW,
  verifyTransactionMW,
} = require("./validators");
const transactionController = require("./controllers");

transactionRouter.post(
  "/create-transaction",
  createTransactionValidationMW,
  transactionController.createTransaction
);

transactionRouter.post(
  "/verify-transaction",
  verifyTransactionMW,
  transactionController.verifyTransaction
);

module.exports = transactionRouter;
