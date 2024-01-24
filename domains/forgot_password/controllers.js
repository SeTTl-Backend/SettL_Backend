const { v4: uuidv4 } = require("uuid");
require("dotenv").config();
const userModel = require("../user/model");
const ForgotPasswordModel = require("./model");
const hashedData = require("../../utils/hashedData");
const verifyHashedData = require("../../utils/verifyHashedData");
const sendEmail = require("../../utils/sendEmail");

async function requestPasswordReset(req, res) {
  let { email, redirectUrl } = req.body;
  try {
    const fetchedUser = await userModel.find({ email });
    if (!fetchedUser?.length) {
      res.status(200).send({
        message: "No account with the supplied email exist",
        status: 400,
      });
    } else {
      if (!fetchedUser[0]?.isVerified) {
        res.status(200).send({
          message: "Email hasn't been verified yet, check your inbox",
          status: 400,
        });
      } else {
        const { _id, email } = fetchedUser[0];
        const resetString = uuidv4() + _id;
        await ForgotPasswordModel.deleteMany({ userId: _id });
        const mailOptions = {
          from: process.env.AUTH_EMAIL,
          to: email,
          subject: "Password Reset",
          html: `<p>We heard you lost your password</p><p>Don't worry use this link to reset your password</p><p>This link <b>expires in 60 minutes</b>.<p>Press <a href=${
            redirectUrl + "/" + _id + "/" + resetString
          } target="_blank"> to proceed</a></p></p>`,
        };
        const hashedResetString = await hashedData(resetString);
        const newPasswordReset = new ForgotPasswordModel({
          userId: _id,
          resetString: hashedResetString,
          createdAt: Date.now(),
          expiredAt: Date.now() + 3600000,
        });

        await newPasswordReset.save();
        await sendEmail(mailOptions);

        res.status(200).send({
          message: "Reset password mail sent successfully",
          status: 400,
        });
      }
    }
  } catch (err) {
    console.log(err);
    res.status(500).send({
      message: "Something went wrong while sending reset password email",
      status: 400,
    });
  }
}

async function passwordReset(req, res) {
  let { userId, resetString, newPassword } = req.body;
  try {
    const passwordReset = await ForgotPasswordModel.find({ userId });
    if (passwordReset?.length > 0) {
      const { expiredAt } = passwordReset[0];
      const hashedResetString = passwordReset[0].resetString;
      if (expiredAt < Date.now()) {
        await PasswordReset.deleteOne({ userId });
        res.status(200).send({
          message: "Password reset link has expired",
          status: 400,
        });
      } else {
        const resetStringMatch = await verifyHashedData(
          resetString,
          hashedResetString
        );
        if (!resetStringMatch) {
          res.status(200).send({
            message: "Invalid password reset details provided",
            status: 400,
          });
        } else {
          const hashedNewPassword = await hashedData(newPassword);
          await userModel.updateOne(
            { _id: userId },
            { password: hashedNewPassword }
          );
          await ForgotPasswordModel.deleteOne({ userId });
          res.status(200).send({
            message: "Password updated successfully",
            status: 200,
          });
        }
      }
    } else {
      res.status(200).send({
        message: "Password reset request not found",
        status: 400,
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send({
      message: "Something went wrong while resetting your password",
      status: 400,
    });
  }
}

module.exports = { requestPasswordReset, passwordReset };
