const Joi = require("joi");

const ContactOurSupportSchema = Joi.object({
  fullName: Joi.string().max(255).trim().required(),
  email: Joi.string().email().trim().required(),
  message: Joi.string().trim().required(),
  createAt: Joi.date().default(Date.now),
});

async function ContactOurSupportMW(req, res, next) {
  const contactOurSupportPayLoad = req.body;
  try {
    await ContactOurSupportSchema.validateAsync(contactOurSupportPayLoad);
    next();
  } catch (error) {
    next({
      message: error.details[0].message,
      status: 400,
    });
  }
}

module.exports = {
  ContactOurSupportMW,
};
