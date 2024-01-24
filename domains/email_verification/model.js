const mongoose = require("mongoose");

//Define a schema
const Schema = mongoose.Schema;

const UserVerificationSchema = new Schema({
  userId: {
    type: String,
    required: true,
  },
  uniqueString: {
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

const UserVerification = mongoose.model(
  "UserVerification",
  UserVerificationSchema
);

module.exports = UserVerification;
