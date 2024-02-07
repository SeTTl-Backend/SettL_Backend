require("dotenv").config();
const mongoose = require("mongoose");
const sendEmail = require("../../utils/sendEmail");
const Schema = mongoose.Schema;

const ContactOurSupportSchema = new Schema({
  fullName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  createAt: {
    type: Date,
    default: Date.now,
  },
});

//Define a function to send reset password emails
async function sendNotificationEmail(email) {
  try {
    const mailOptions = {
      from: process.env.AUTH_EMAIL,
      to: email,
      subject: "Contact Support",
      html: `<p>Thank you for contacting support!</p>
         <p>We have received your message and will get back to you as soon as possible.</p>
         <p>If you have any urgent issues or questions, feel free to reach out to us directly.</p>
         <p>Best regards,<br/>Your Support Team</p>`,
    };
    await sendEmail(mailOptions);
  } catch (err) {
    console.log("Error occurred while sending password notification email");
    throw err;
  }
}

//Define a function to send emails
ContactOurSupportSchema.pre("save", async function (next) {
  console.log("New document saved to the database");
  // Only send an email when a new document has been created.
  if (this.isNew) {
    await sendNotificationEmail(this.email);
  }
  next();
});

const ContactOurSupport = mongoose.model(
  "ContactOurSupport",
  ContactOurSupportSchema
);

module.exports = ContactOurSupport;
