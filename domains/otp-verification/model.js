require("dotenv").config();
const mongoose = require("mongoose");
const sendEmail = require("../../utils/sendEmail");

//Define a schema
const Schema = mongoose.Schema;

const OtpModelSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  createAt: {
    type: Date,
    default: Date.now,
    expires: 60 * 5, // The document will be automatically deleted after 5 minutes
  },
});

//Define a function to send otp emails
async function sendOtpVerificationEmail(email, otp) {
  try {
    const mailOptions = {
      from: process.env.AUTH_EMAIL,
      to: email,
      subject: "Verification Email",
      html: `<h1>Please confirm your OTP</h1></br><p>Here is your OTP code: ${otp}.`,
    };
    await sendEmail(mailOptions);
  } catch (err) {
    console.log("Error occurred while sending otp verification email");
    throw err;
  }
}

//Define a function to send emails
OtpModelSchema.pre("save", async function (next) {
  console.log("New document saved to the database");
  // Only send an email when a new document has been created.
  if (this.isNew) {
    await sendOtpVerificationEmail(this.email, this.otp);
  }
  next();
});

const OtpModel = mongoose.model("OtpModel", OtpModelSchema);

module.exports = OtpModel;
