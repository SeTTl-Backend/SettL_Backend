require("dotenv").config();
const mongoose = require("mongoose");
const sendEmail = require("../../utils/sendEmail");
const Schema = mongoose.Schema;

const ForgotPasswordSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  resetString: {
    type: String,
    required: true,
  },
  hashedResetString: {
    type: String,
    required: true,
  },
  redirectUrl: {
    type: String,
    required: true,
  },
  createAt: {
    type: Date,
    default: Date.now,
  },
  expiredAt: {
    type: Date,
    default: Date.now,
  },
});

//Define a function to send reset password emails
async function sendVerificationEmail(email, redirectUrl, userId, resetString) {
  try {
    const mailOptions = {
      from: process.env.AUTH_EMAIL,
      to: email,
      subject: "Password Reset",
      html: `<p>We heard you lost your password</p><p>Don't worry use this link to reset your password</p><p>This link <b>expires in 60 minutes</b>.<p>Press <a href=${
        redirectUrl + "/" + userId + "/" + resetString
      } target="_blank"> to proceed</a></p></p>`,
    };
    await sendEmail(mailOptions);
  } catch (err) {
    console.log("Error occurred while sending password verification email");
    throw err;
  }
}

//Define a function to send emails
ForgotPasswordSchema.pre("save", async function (next) {
  console.log("New document saved to the database");
  // Only send an email when a new document has been created.
  if (this.isNew) {
    await sendVerificationEmail(
      this.email,
      this.redirectUrl,
      this.userId,
      this.resetString
    );
  }
  next();
});

const ForgotPassword = mongoose.model("ForgotPassword", ForgotPasswordSchema);

module.exports = ForgotPassword;
