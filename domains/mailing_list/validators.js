const Joi = require("joi");

const MailingListSchema = Joi.object({
  email: Joi.string().email().trim().required(),
  createAt: Joi.date().default(Date.now),
});

async function MailingListValidationMW(req, res, next) {
  const mailListPayLoad = req.body;
  try {
    await MailingListSchema.validateAsync(mailListPayLoad);
    next();
  } catch (error) {
    next({
      message: error.details[0].message,
      status: 400,
    });
  }
}

module.exports = {
  MailingListValidationMW,
};
