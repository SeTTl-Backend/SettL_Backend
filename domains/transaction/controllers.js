require("dotenv").config();
const https = require("https");
const util = require("util");
const transactionModel = require("./model");
const userModel = require("../user/model");

const httpsRequest = util.promisify(https.request);

async function createTransaction(req, res) {
  const { reference, userId, formData } = req.body;
  const status = req.body;
  try {
    const options = {
      hostname: "api.paystack.co",
      port: 443,
      path: `/transaction/verify/${reference}`,
      method: "GET",
      headers: {
        Authorization: `Bearer ${process.env.REACT_APP_PAYSTACK_PUBLIC_KEY}`,
      },
    };

    const existingUser = await userModel.find({
      email: formData?.counterpartyEmail,
    });
    if (!existingUser?.length) {
      return res.json({
        message: "Seller must be registered with us",
        status: 401,
      });
    }

    const apiRes = await httpsRequest(options);
    let data = "";

    apiRes.on("data", (chunk) => {
      data += chunk;
    });

    apiRes.on("end", async () => {
      if (existingUser?.role?.toLowerCase() === "buyer") {
        await userModel.updateOne(
          { _id: existingUser?._id },
          {
            walletDetails:
              Number(existingUser?.walletDetails) + Number(formData?.amount),
          }
        );
      }
      status = "PENDING";
      try {
        const newTransaction = new transactionModel({
          reference,
          status,
          sellerId: existingUser?._id,
          buyerId: userId,
          formData,
        });

        const createdTransaction = await newTransaction.save();
        res.json({
          status: 201,
          message: "Transaction created successfully",
          data,
        });
      } catch (error) {
        res.status(500).json({
          status: 500,
          message:
            error.message || "An error occurred while saving the transaction",
        });
      }
    });

    apiRes.on("error", (error) => {
      res.status(500).json({
        status: 500,
        message:
          error.message ||
          "An error occurred while fetching data from Paystack API",
      });
    });
  } catch (err) {
    res.json({
      status: 500,
      message: err.message || "An Error occurred",
    });
  }
}

module.exports = {
  createTransaction,
};
