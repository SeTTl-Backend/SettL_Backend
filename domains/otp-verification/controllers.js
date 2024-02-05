require("dotenv").config();
const otpGenerator = require("otp-generator");
const userModel = require("../user/model");
const OtpModel = require("./model");

async function sendOtp(req, res) {
  try {
    const { email } = req.body;

    // check if user is already present
    const checkUserPresent = await userModel.find({ email });

    if (checkUserPresent?.length) {
      return res.json({
        message: "User already registered",
        status: 401,
      });
    }
    let otp = otpGenerator.generate(4, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });
    let result = await OtpModel.findOne({ otp: otp });
    while (result) {
      otp = otpGenerator.generate(4, {
        upperCaseAlphabets: false,
      });
      result = await OtpModel.findOne({ otp: otp });
    }

    const otpPayload = { email, otp };
    const otpBody = await OtpModel.create(otpPayload);

    res.json({
      status: 200,
      message: "OTP sent successfully",
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({
      message: err.message,
      status: 500,
    });
  }
}

module.exports = { sendOtp };
