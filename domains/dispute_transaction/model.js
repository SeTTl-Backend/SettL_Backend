require("dotenv").config();
const mongoose = require("mongoose");
const sendEmail = require("../../utils/sendEmail");
const Schema = mongoose.Schema;
const userModel = require("../user/model");

const DisputeTransactionSchema = new Schema({
  userId: {
    type: String,
    required: true,
    trim: true,
  },
  transactionId: {
    type: String,
    required: true,
  },
  reason: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  createAt: {
    type: Date,
    default: Date.now,
  },
});

//Define a function to send reset password emails
async function sendNotificationEmail(userId, transactionId) {
  try {
    const user = await userModel.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    const mailOptions = {
      from: process.env.AUTH_EMAIL,
      to: user.email,
      subject: "Dispute Transaction",
      html: `<p>Thank you for Disputing this transaction!</p>
         <p>We have received your dispute with id ${transactionId} and will resolve the dispute as soon as possible.</p>
         <p>If you have any other issues or questions, feel free to reach out to us directly.</p>
         <p>Best regards,<br/>Your Support Team</p>`,
    };
    await sendEmail(mailOptions);
  } catch (err) {
    console.log("Error occurred while sending dispute transaction email:", err);
    throw err;
  }
}

//Define a function to send emails
DisputeTransactionSchema.pre("save", async function (next) {
  console.log("New document saved to the database");
  // Only send an email when a new document has been created.
  if (this.isNew) {
    await sendNotificationEmail(this.userId, this.transactionId);
  }
  next();
});

const DisputeTransaction = mongoose.model(
  "DisputeTransaction",
  DisputeTransactionSchema
);

module.exports = DisputeTransaction;
