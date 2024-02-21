const mongoose = require("mongoose");

//Define a schema
const Schema = mongoose.Schema;

//Define user schema
const UserSchema = new Schema({
  firstName: {
    type: String,
    required: true,
    trim: true,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
  },
  role: {
    type: String,
    required: true,
  },
  walletDetails: {
    type: Number,
    required: false,
  },
  password: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: false,
  },
  phoneNumber: {
    type: String,
  },
  profilePicture: {
    type: String,
  },
  bvn: {
    type: String,
  },
  identificationDetails: {
    idType: String,
    iDNumber: String,
  },
  headShot: { type: String },
  contactDetails: {
    houseAddress: { type: String },
    nearestLandmark: { type: String },
    officeAddress: { type: String },
    deliveryAddress: { type: String },
    postalCode: { type: String },
    proofOfAddress: { type: String },
  },
  accountDetails: {
    bankName: { type: String },
    accountNumber: { type: String },
    accountName: { type: String },
  },
  nextOfKin: {
    fullName: { type: String },
    relationship: { type: String },
    contactNumber: { type: String },
  },
  isVerified: { type: Boolean },
  createAt: {
    type: Date,
    default: Date.now,
  },
  lastUpdateAt: {
    type: Date,
    default: Date.now,
  },
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
