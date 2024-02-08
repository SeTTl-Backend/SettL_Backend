const mongoose = require("mongoose");

//Define a schema
const Schema = mongoose.Schema;

//Define transaction schema
const TransactionSchema = new Schema({
  reference: {
    type: String,
    required: true,
    trim: true,
  },
  sellerId: {
    type: String,
    required: true,
    trim: true,
  },
  buyerId: {
    type: String,
    required: true,
    trim: true,
  },
  status: {
    type: String,
    required: true,
    trim: true,
  },
  formData: {
    role: { type: String },
    transactionType: { type: String },
    amount: { type: String },
    deliveryAddress: { type: String },
    productName: { type: String },
    counterpartyName: { type: String },
    counterpartyEmail: { type: String },
    counterpartyPhone: { type: String },
    setConditions: { type: String },
    termsAndConditions: { type: Boolean, default: false },
  },
  createAt: {
    type: Date,
    default: Date.now,
  },
  lastUpdateAt: {
    type: Date,
    default: Date.now,
  },
});

//Define a function to send  email to the seller
async function sendAcceptanceEmail(formData) {
  try {
    const mailOptions = {
      from: process.env.AUTH_EMAIL,
      to: formData?.counterpartyEmail,
      subject: "Transaction Confirmation",
      html: `<h1>Please ${formData?.counterpartyName} confirm the transaction</h1>
      <p>You have received a transaction request. Please review the details below and click on the appropriate link to confirm or decline the transaction:</p>
      <p>Transaction Details:</p>
      <ul>
        <li><strong>Transaction Type:</strong> ${formData.transactionType}</li>
        <li><strong>Amount:</strong> ${formData.amount}</li>
        <li><strong>Delivery Address:</strong> ${formData.deliveryAddress}</li>
      </ul>
      <p>To confirm the transaction, click <a href="https://localhost:3000/confirm-transaction?action=accept">here</a>.</p>
      <p>To decline the transaction, click <a href="https://localhost:3000/confirm-transaction?action=decline">here</a>.</p>`,
    };
    await sendEmail(mailOptions);
  } catch (err) {
    console.log("Error occurred while sending otp verification email");
    throw err;
  }
}

//Define a function to send emails
TransactionSchema.pre("save", async function (next) {
  console.log("New document saved to the database");
  // Only send an email when a new document has been created.
  if (this.isNew) {
    await sendAcceptanceEmail(this.formData);
  }
  next();
});

const Transaction = mongoose.model("Transaction", TransactionSchema);

module.exports = Transaction;
