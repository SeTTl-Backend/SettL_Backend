const Joi = require("joi");

const RegisterUserSchema = Joi.object({
  firstName: Joi.string().max(255).trim().required(),
  lastName: Joi.string().max(255).required().trim(),
  email: Joi.string().email().trim().required(),
  role: Joi.string().trim().required(),
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
  password: Joi.string().required(),
});

const UpdateUserProfileSchema = Joi.object({
  phoneNumber: Joi.string().trim().required(),
  profilePicture: Joi.string().uri().required(),
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

async function UpdateUserProfileValidationMW(req, res, next) {
  const userPayLoad = req.body;

  try {
    await UpdateUserProfileSchema.validateAsync(userPayLoad);
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
  UpdateUserProfileValidationMW,
};
