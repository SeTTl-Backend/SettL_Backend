const Joi = require("joi");

const RegisterUserSchema = Joi.object({
  firstName: Joi.string().max(255).trim().required(),
  lastName: Joi.string().max(255).required().trim(),
  dob: Joi.date().greater("1-1-1900").less("1-1-2022").required(),
  email: Joi.string().email().trim().required(),
  phoneNumber: Joi.string()
    .trim()
    .pattern(/^[0-9]{11}$/)
    .required(),
  password: Joi.string()
    .min(8)
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
    )
    .required(),
  otp: Joi.string().required(),
  createAt: Joi.date().default(Date.now),
  lastUpdateAt: Joi.date().default(Date.now),
});

const AuthenticateUserSchema = Joi.object({
  email: Joi.string().email().trim().required(),
  password: Joi.string()
    .min(8)
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
    )
    .required(),
});

async function RegisterUserValidationMW(req, res, next) {
  const userPayLoad = req.body;

  try {
    await RegisterUserSchema.validateAsync(userPayLoad);
    next();
  } catch (error) {
    next({
      message: error.details[0].message,
      status: 400,
    });
  }
}

async function AuthenticateUserValidationMW(req, res, next) {
  const userPayLoad = req.body;

  try {
    await AuthenticateUserSchema.validateAsync(userPayLoad);
    next();
  } catch (error) {
    next({
      message: error.details[0].message,
      status: 400,
    });
  }
}

module.exports = {
  RegisterUserValidationMW,
  AuthenticateUserValidationMW,
};
