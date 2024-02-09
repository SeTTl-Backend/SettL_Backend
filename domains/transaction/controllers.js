require("dotenv").config();
const axios = require("axios");
const transactionModel = require("./model");
const userModel = require("../user/model");

async function createTransaction(req, res) {
  const { reference, buyerId, formData } = req.body;
  let status = req.body; // Make sure to use let instead of const

  try {
    const existingSeller = await userModel.find({
      email: formData?.counterpartyEmail,
    });
    if (!existingSeller?.length) {
      return res.json({
        message: "Seller must be registered with us",
        status: 401,
      });
    }

    if (existingSeller?.role?.toLowerCase() === "buyer") {
      return res.json({ message: "Counterparty is not a seller", status: 401 });
    }

    const response = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.REACT_APP_PAYSTACK_SECRETE_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const data = response.data;

    // Perform actions based on response data or seller/buyer roles
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

    const newTransaction = new transactionModel({
      reference,
      status,
      sellerId: existingUser?._id,
      buyerId: buyerId,
      formData,
    });

    const createdTransaction = await newTransaction.save();

    res.json({
      status: 201,
      message: "Transaction created successfully",
      data,
    });
  } catch (error) {
    res
      .status(500)
      .json({ status: 500, message: error.message || "An error occurred" });
  }
}
module.exports = {
  createTransaction,
};
