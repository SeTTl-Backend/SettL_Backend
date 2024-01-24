const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ForgotPasswordSchema = new Schema({
  userId: {
    type: String,
    required: true,
  },
  resetString: {
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

const ForgotPassword = mongoose.model("ForgotPassword", ForgotPasswordSchema);

module.exports = ForgotPassword;
