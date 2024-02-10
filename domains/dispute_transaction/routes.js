const express = require("express");
const { DisputeTransactionMW } = require("./validators");
const DisputeTransactionRouter = express.Router();

const disputeTransactionController = require("./controllers");

DisputeTransactionRouter.post(
  "/dispute-transaction",
  DisputeTransactionMW,
  disputeTransactionController.disputeTransaction
);

module.exports = DisputeTransactionRouter;
