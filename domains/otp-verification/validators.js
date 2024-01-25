const Joi = require("joi");

const OtpSchema = Joi.object({
  email: Joi.string().email().trim().required(),
  otp: Joi.string().optional(),
  createAt: Joi.date().default(Date.now),
  lastUpdateAt: Joi.date().default(Date.now),
});

async function OtpValidationMW(req, res, next) {
  const userPayLoad = req.body;

  try {
    await OtpSchema.validateAsync(userPayLoad);
    next();
  } catch (error) {
    next({
      message: error.details[0].message,
      status: 400,
    });
  }
}

module.exports = {
  OtpValidationMW,
};
