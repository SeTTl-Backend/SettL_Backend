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
    termsAndConditions: Joi.string().trim().required(),
  }),
  redirectUrl: Joi.string().max(255).trim().required(),
  createdAt: Joi.date().default(Date.now),
  lastUpdatedAt: Joi.date().default(Date.now),
});

const VerifyTransactionSchema = Joi.object({
  transactionId: Joi.string().trim().required(),
  action: Joi.string().trim().required(),
});

const VerifyTransactionDetailsSchema = Joi.object({
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
    termsAndConditions: Joi.string().trim().required(),
  }),
  createdAt: Joi.date().default(Date.now),
  lastUpdatedAt: Joi.date().default(Date.now),
});

const UpdateTransactionStatusSchema = Joi.object({
  newStatus: Joi.string().trim().required(),
  transactionId: Joi.string().trim().required(),
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

async function verifyTransactionDetailsValidationMW(req, res, next) {
  const verifyTransactionDetailsPayLoad = req.body;

  try {
    await VerifyTransactionDetailsSchema.validateAsync(
      verifyTransactionDetailsPayLoad
    );
    next();
  } catch (error) {
    next({
      message: error.details[0].message,
      status: 400,
    });
  }
}

async function updateTransactionStatusValidationMW(req, res, next) {
  const updateTransactionStatusPayLoad = req.body;

  try {
    await UpdateTransactionStatusSchema.validateAsync(
      updateTransactionStatusPayLoad
    );
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
  verifyTransactionDetailsValidationMW,
  updateTransactionStatusValidationMW,
};
