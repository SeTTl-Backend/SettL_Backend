const Joi = require("joi");

const DisputeTransactionSchema = Joi.object({
  userId: Joi.string().required().trim(),
  transactionId: Joi.string().trim().required(),
  reason: Joi.string().max(255).trim().required(),
  description: Joi.string().trim().required(),
  createAt: Joi.date().default(Date.now),
});

async function DisputeTransactionMW(req, res, next) {
  const disputeTransactionPayLoad = req.body;
  try {
    await DisputeTransactionSchema.validateAsync(disputeTransactionPayLoad);
    next();
  } catch (error) {
    next({
      message: error.details[0].message,
      status: 400,
    });
  }
}

module.exports = {
  DisputeTransactionMW,
};
