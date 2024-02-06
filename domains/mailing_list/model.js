require("dotenv").config();
const mongoose = require("mongoose");
const sendEmail = require("../../utils/sendEmail");
const Schema = mongoose.Schema;

const MailingListSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  createAt: {
    type: Date,
    default: Date.now,
  },
});

//Define a function to send mail list confirmation emails
async function sendConfirmationEmail(email) {
  try {
    const mailOptions = {
      from: process.env.AUTH_EMAIL,
      to: email,
      subject: "Subscription Confirmation",
      html: `<p>Thank you for subscribing to our mailing list!</p>
             <p>You are now part of our community and will receive updates, news, and special offers directly in your inbox.</p>
             <p>If you have any questions or concerns, feel free to contact us.</p>
             <p>Best regards,<br/>Your Mailing List Team</p>`,
    };
    await sendEmail(mailOptions);
  } catch (err) {
    console.log(
      "Error occurred while sending password mail list confirmation email"
    );
    throw err;
  }
}

//Define a function to send emails
MailingListSchema.pre("save", async function (next) {
  console.log("New document saved to the database");
  // Only send an email when a new document has been created.
  if (this.isNew) {
    await sendConfirmationEmail(this.email);
  }
  next();
});

const MailingList = mongoose.model("MailingList", MailingListSchema);

module.exports = MailingList;
