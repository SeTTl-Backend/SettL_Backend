require("dotenv").config();
const DisputeTransactionMW = require("./validators");
const disputeTransactionModel = require("./model");

async function disputeTransaction(req, res) {
  const { error } = DisputeTransactionMW.validate(req.body);

  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const { transactionId, reason, description, userId } = req.body;
  try {
    const newdisputeRequest = new disputeTransactionModel({
      transactionId: transactionId,
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
