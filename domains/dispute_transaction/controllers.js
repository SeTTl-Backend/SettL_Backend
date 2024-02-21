require("dotenv").config();
const disputeTransactionModel = require("./model");
const transactionModel = require("../transaction/model");

async function disputeTransaction(req, res) {
  const { transactionId, reason, description, userId } = req.body;
  try {
    const transaction = await transactionModel.findById(transactionId);

    if (!transaction) {
      return res.json({
        status: 401,
        message: "Transaction not found",
      });
    }

    const selectedTransactionStatus = ["PENDING", "VERIFIED", "DISPATCHED"];

    if (selectedTransactionStatus.includes(transaction?.status)) {
      return res.json({
        status: 401,
        message: "Transaction has not been received by the buyer",
      });
    }

    const newDisputeRequest = new disputeTransactionModel({
      transactionId: transactionId,
      reason: reason,
      description: description,
      userId: userId,
      createdAt: Date.now(),
    });

    // Do you want us to be able to create multiple disputes for a particular transaction

    await newDisputeRequest.save();
    res.json({
      message: "Your dispute has been registered. We will resolve shortly.",
      status: 201,
    });
  } catch (err) {
    console.log(err);
    res.json({
      message: "Something went wrong. Please try again later.",
      status: 500,
    });
  }
}

module.exports = { disputeTransaction };
