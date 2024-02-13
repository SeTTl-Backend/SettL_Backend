require("dotenv").config();
const disputeTransactionModel = require("./model");

async function disputeTransaction(req, res) {
  let { transactionID, reason, description, userId } = req.body;
  try {
    const newdisputeRequest = new disputeTransactionModel({
      transactionID: transactionID,
      reason: reason,
      description: description,
      userId: userId,
      createdAt: Date.now(),
    });

    await newdisputeRequest.save();
    res.json({
      message: "Your dispute has been registered. We will resolve shortly.",
      status: 201,
    });
  } catch (err) {
    console.log(err);
    res.send({
      message: "Something went wrong. Please try again later.",
      status: 500,
    });
  }
}

module.exports = { disputeTransaction };
