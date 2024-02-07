require("dotenv").config();
const contactOurSupportModel = require("./model");

async function contactOurSupport(req, res) {
  let { fullName, email, message } = req.body;
  try {
    const newSupportRequest = new contactOurSupportModel({
      fullName: fullName,
      email: email,
      message: message,
      createdAt: Date.now(),
    });

    await newSupportRequest.save();
    res.json({
      message:
        "Your message has been sent to our support team successfully. We will get back to you shortly.",
      status: 201,
    });
  } catch (err) {
    console.log(err);
    res.send({
      message:
        "Something went wrong while sending your message to our support team. Please try again later.",
      status: 500,
    });
  }
}

module.exports = { contactOurSupport };
