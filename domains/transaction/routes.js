const express = require("express");
const transactionRouter = express.Router();
const { VerifyTokenMW } = require("../../auth/tokenAuth");
const {
  createTransactionValidationMW,
  verifyTransactionMW,
  verifyTransactionDetailsValidationMW,
  updateTransactionStatusValidationMW,
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

transactionRouter.post(
  "/verify-transaction-details",
  verifyTransactionDetailsValidationMW,
  transactionController.verifyTransactionDetails
);

transactionRouter.post(
  "/update-transaction-status",
  updateTransactionStatusValidationMW,
  VerifyTokenMW,
  transactionController.updateTransactionStatus
);

module.exports = transactionRouter;
