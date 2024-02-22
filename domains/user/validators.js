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
  firstName: Joi.string().max(255).trim().required(),
  lastName: Joi.string().max(255).required().trim(),
  userId: Joi.string().required().trim(),
  phoneNumber: Joi.string().trim().required(),
  profilePicture: Joi.string().uri().required(),
});

const UpdateUserAccountDetailsSchema = Joi.object({
  accountName: Joi.string().max(255).trim().required(),
  bankName: Joi.string().max(255).required().trim(),
  accountNumber: Joi.string().required().trim(),
  password: Joi.string().trim().required(),
  userId: Joi.string().required().trim(),
});

const UpdateUserContactDetailsSchema = Joi.object({
  homeAddress: Joi.string().max(255).trim().required(),
  nearestLandmark: Joi.string().max(255).required().trim(),
  officeAddress: Joi.string().required().trim(),
  postalCode: Joi.string().required().trim(),
  proofOfAddress: Joi.string().uri().required(),
  userId: Joi.string().required().trim(),
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

async function UpdateUserAccountDetailsValidationMW(req, res, next) {
  const userPayLoad = req.body;

  try {
    await UpdateUserAccountDetailsSchema.validateAsync(userPayLoad);
    next();
  } catch (error) {
    next({
      message: error.details[0].message,
      status: 400,
    });
  }
}

async function UpdateUserContactDetailsValidationMW(req, res, next) {
  const userPayLoad = req.body;

  try {
    await UpdateUserContactDetailsSchema.validateAsync(userPayLoad);
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
  UpdateUserAccountDetailsValidationMW,
  UpdateUserContactDetailsValidationMW,
};
