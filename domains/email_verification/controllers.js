require("dotenv").config();
const { v4: uuidv4 } = require("uuid");
const verifyHashedData = require("../../utils/verifyHashedData");
const userVerificationModel = require("./model");
const userModel = require("../user/model");

const hashedData = require("../../utils/hashedData");
const sendEmail = require("../../utils/sendEmail");

const sendVerificationEmail = async ({ _id, email }) => {
  try {
    const currentUrl = process.env.BASE_URL || "http://localhost:5000/";

    const uniqueString = uuidv4() + _id;

    const mailOptions = {
      from: process.env.AUTH_EMAIL,
      to: email,
      subject: "Verify your email",
      html: `<p>Verify your email address to complete the signup and login to your account</p><p>This link <b>expires in 6 hours</b>.<p>Press <a href=${
        currentUrl + "api/v1/verify/" + _id + "/" + uniqueString
      } target="_blank"> to proceed</a></p></p>`,
    };

    //hash the unique string
    const saltRounds = 10;
    const hashedUniqueString = await hashedData(uniqueString, saltRounds);
    const newVerification = new userVerificationModel({
      userId: _id,
      uniqueString: hashedUniqueString,
      createdAt: Date.now(),
      expiredAt: Date.now() + 3600000,
    });

    await newVerification.save();
    await sendEmail(mailOptions);

    return {
      userId: _id,
      email,
    };
  } catch (err) {
    console.log(err);
    res.status(500).send({
      status: 500,
      message: "Sending email verification failed",
    });
  }
};

async function userVerification(req, res) {
  // const clientUrl = process.env.CLIENT_URL;
  let { userId, uniqueString } = req.params;
  try {
    const result = await userVerificationModel.find({ userId });
    if (result.length > 0) {
      const { expiredAt } = result[0];
      const hashedUniqueString = result[0].uniqueString;

      if (expiredAt < Date.now()) {
        // record has expired so delete record
        await userVerificationModel.deleteOne({ userId });
        await userModel.deleteOne({ _id: userId });
        let responseMessage = "Link has expired, please sign up again.";
        // res.redirect(`${clientUrl}auth/verified?error=true&message=${message}`);
        res.status(200).send({
          message: responseMessage,
          status: 400,
        });
      } else {
        // valid record exist
        // first compare the hashed uniqueString
        const hashedString = await verifyHashedData(
          uniqueString,
          hashedUniqueString
        );
        if (!hashedString) {
          res.status(200).send({
            message: "Invalid verification details passed, check your inbox",
            status: 400,
          });
        } else {
          await userModel.updateOne({ _id: userId }, { isVerified: true });
          await userVerificationModel.deleteOne({ userId });
          res.status(200).send({
            message: "User verification complete",
            status: 200,
          });
        }
        // if (hashedString) {
        //   await userModel.updateOne({ _id: userId }, { isVerified: true });
        //   await UserVerification.deleteOne({ userId });
        //   res.redirect(`${clientUrl}auth/verified/`);
        // } else {
        //   // existing record, incorrect link
        //   let message = "Invalid verification details passed, check your inbox";
        //   res.redirect(
        //     `${clientUrl}auth/verified?error=true&message=${message}`
        //   );
        // }
      }
    } else {
      // let message = "Account record doesn't exist or has been verified already";
      // res.redirect(`${clientUrl}auth/verified?error=true&message=${message}`);
      res.status(200).send({
        message: "Account record doesn't exist or has been verified already",
        status: 400,
      });
    }
  } catch (err) {
    // let message = "An error occurred while verifying the account";
    // res.redirect(`${clientUrl}auth/verified?error=true&message=${message}`);
    res.status(200).send({
      message: "An error occurred while verifying the account",
      status: 400,
    });
  }
}

module.exports = { sendVerificationEmail, userVerification };
