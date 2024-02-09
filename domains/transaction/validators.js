const Joi = require("joi");

const TransactionSchema = Joi.object({
  reference: Joi.string().required().trim(),
  buyerId: Joi.string().required().trim(),
  formData: Joi.object({
    transactionType: Joi.string().trim().required(),
    amount: Joi.number().required(),
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
  redirectUrl: Joi.string().max(255).trim().required(),
  createdAt: Joi.date().default(Date.now),
  lastUpdatedAt: Joi.date().default(Date.now),
});

const VerifyTransactionSchema = Joi.object({
  transactionId: Joi.string().max(255).trim().required(),
  action: Joi.string().max(255).trim().required(),
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

async function verifyTransactionMW(req, res, next) {
  const createTransactionPayLoad = req.body;

  try {
    await VerifyTransactionSchema.validateAsync(createTransactionPayLoad);
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
  verifyTransactionMW,
};
