const Joi = require("joi");

const TransactionSchema = Joi.object({
  reference: Joi.string().required().trim(),
  userId: Joi.string().required().trim(),
  formData: Joi.object({
    transactionType: Joi.string().trim().required(),
    amount: Joi.string().trim().required(),
    deliveryAddress: Joi.string().trim().required(),
    productName: Joi.string().trim().required(),
    counterpartyName: Joi.string().trim().required(),
    counterpartyEmail: Joi.string().email().trim().required(),
    counterpartyPhone: Joi.string()
      .pattern(/^[0-9]{11}$/)
      .trim()
      .required(),
    setConditions: Joi.string().trim().required(),
    termsAndConditions: Joi.boolean().required(),
  }),
  createdAt: Joi.date().default(Date.now),
  lastUpdatedAt: Joi.date().default(Date.now),
});

async function createTransactionValidationMW(req, res, next) {
  const createTransactionPayLoad = req.body;

  try {
    await TransactionSchema.validateAsync(createTransactionPayLoad);
    next();
  } catch (error) {
    next({
      message: error.details[0].message,
      status: 400,
    });
  }
}

module.exports = {
  createTransactionValidationMW,
};
