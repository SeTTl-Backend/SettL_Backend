const Joi = require("joi");

const RequestPasswordResetSchema = Joi.object({
  redirectUrl: Joi.string().max(255).trim().required(),
  email: Joi.string().email().trim().required(),
});

const PasswordResetSchema = Joi.object({
  userId: Joi.string().max(255).trim().required(),
  resetString: Joi.string().max(255).trim().required(),
  newPassword: Joi.string()
    .min(8)
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
    )
    .required(),
});

async function RequestPasswordResetMW(req, res, next) {
  const userPayLoad = req.body;

  try {
    await RequestPasswordResetSchema.validateAsync(userPayLoad);
    next();
  } catch (error) {
    next({
      message: error.details[0].message,
      status: 400,
    });
  }
}

async function PasswordResetMW(req, res, next) {
  const userPayLoad = req.body;

  try {
    await PasswordResetSchema.validateAsync(userPayLoad);
    next();
  } catch (error) {
    next({
      message: error.details[0].message,
      status: 400,
    });
  }
}

module.exports = {
  RequestPasswordResetMW,
  PasswordResetMW,
};
