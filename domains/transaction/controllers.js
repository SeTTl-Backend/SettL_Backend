require("dotenv").config();
const axios = require("axios");
const transactionModel = require("./model");
const userModel = require("../user/model");
const sendEmail = require("../../utils/sendEmail");

async function createTransaction(req, res) {
  const { reference, buyerId, formData, redirectUrl } = req.body;
  let status = req.body; // Make sure to use let instead of const

  try {
    const existingTransaction = await transactionModel.find({
      buyerId: buyerId,
    });
    if (existingTransaction[0]?.reference === reference) {
      return res.json({
        message: "Oops, duplicate transaction found",
        status: 401,
      });
    }

    const existingSeller = await userModel.find({
      email: formData?.counterpartyEmail,
    });
    if (!existingSeller?.length) {
      return res.json({
        message: "Seller must be registered with us",
        status: 401,
      });
    }
    if (existingSeller[0]?.role !== "seller") {
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
    if (existingSeller[0]?.role === "seller") {
      await userModel.updateOne(
        { _id: existingSeller[0]?._id },
        {
          $inc: { walletDetails: parseFloat(formData?.amount) },
        }
      );
    }

    status = "PENDING";

    const newTransaction = new transactionModel({
      reference,
      status,
      sellerId: existingSeller[0]?._id,
      buyerId: buyerId,
      redirectUrl: redirectUrl,
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

async function handleSendNotificationEmail(to, subject, html) {
  try {
    const mailOptions = {
      from: process.env.AUTH_EMAIL,
      to: Array.isArray(to) ? to.join(", ") : to,
      subject: subject,
      html: html,
    };
    await sendEmail(mailOptions);
  } catch (err) {
    console.log("Error occurred while sending transaction verification email");
    throw err;
  }
}

async function verifyTransaction(req, res) {
  let { transactionId, action } = req.body;
  try {
    const transaction = await transactionModel.find({ _id: transactionId });
    if (transaction?.length > 0) {
      const { status, sellerId, buyerId, formData } = transaction[0];

      if (status !== "PENDING") {
        return res.json({
          message: "Transaction already processed",
          status: 401,
        });
      }

      //fetch buyer
      const fetchedBuyerUser = await userModel.find({
        _id: buyerId.replace(/"/g, ""),
      });
      const fetchedSellerUser = await userModel.find({
        _id: sellerId.replace(/"/g, ""),
      });
      if (!fetchedBuyerUser?.length || !fetchedSellerUser?.length) {
        return res.json({
          message: "Invalid credentials requested",
          status: 401,
        });
      }

      if (action === "decline") {
        await transactionModel.updateOne(
          { _id: transactionId },
          {
            status: "DECLINED",
          }
        );
        // send a mail
        deleteTransactionSubject = "Transaction Declined";
        html = `<h1>Transaction Declined</h1>
                <p>Hello ${fetchedBuyerUser[0]?.firstName},</p>
                <p>We regret to inform you that the transaction request has been declined. Please see the details below:</p>
                <ul>
                  <li><strong>Transaction Type:</strong> ${formData.transactionType}</li>
                  <li><strong>Amount:</strong> ${formData.amount}</li>
                  <li><strong>Delivery Address:</strong> ${formData.deliveryAddress}</li>
                </ul>
                <p>You will receive a refund for this transaction within the next 24 hours.</p>
              `;
        await handleSendNotificationEmail(
          fetchedBuyerUser[0].email,
          deleteTransactionSubject,
          html
        );

        return res.json({
          message: "Transaction successfully declined",
          status: 200,
        });
      }

      await transactionModel.updateOne(
        { _id: transactionId },
        {
          status: "VERIFIED",
        }
      );

      // PENDING, DECLINED, REFUNDED, VERIFIED, DISPATCHED,  RECEIVED, COMPLETED transaction status

      // send a mail
      approvedTransactionSubject = "Transaction Approved";
      html = `
               <p>Hello ${fetchedBuyerUser[0]?.firstName},</p>
                <p>We are pleased to inform you that the transaction request has been approved. Please see the details below:</p>
                <ul>
                  <li><strong>Transaction Type:</strong> ${formData.transactionType}</li>
                  <li><strong>Amount:</strong> ${formData.amount}</li>
                  <li><strong>Delivery Address:</strong> ${formData.deliveryAddress}</li>
                  <li><strong>Terms:</strong> ${formData.termsAndConditions}</li>

                </ul>
                <p>Thank you for your participation. The transaction will proceed as planned.</p>     
              `;
      await handleSendNotificationEmail(
        fetchedBuyerUser[0].email,
        approvedTransactionSubject,
        html
      );
      return res.json({
        message: "Transaction approved",
        status: 200,
      });
    } else {
      res.json({
        message: "Transaction request not found",
        status: 401,
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Something went wrong while verifying transaction",
      status: 500,
    });
  }
}

async function verifyTransactionDetails(req, res) {
  const { formData } = req.body;

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
    if (existingSeller[0]?.role !== "seller") {
      return res.json({ message: "Counterparty is not a seller", status: 401 });
    }

    res.json({
      status: 200,
      message: "Transaction details verified",
    });
  } catch (error) {
    res
      .status(500)
      .json({ status: 500, message: error.message || "An error occurred" });
  }
}

async function updateTransactionStatus(req, res) {
  const { newStatus, transactionId } = req.body;

  try {
    const transaction = await transactionModel.findById(transactionId);

    if (!transaction) {
      return res.json({
        status: 401,
        message: "Transaction not found",
      });
    }

    const sellerUser = userModel.findById(transaction?.sellerId);
    const buyerUser = userModel.findById(transaction?.buyerId);

    await transactionModel.updateOne(
      { _id: transactionId },
      { status: newStatus }
    );

    const subject =
      newStatus === "COMPLETED"
        ? "Transaction completed"
        : "Transaction Status Updated";

    // send a mail
    const recipients = [sellerUser?.email, buyerUser?.email];
    updateTransactionSubject = subject;
    html = `<p>Greetings</p>
            <p>We would like to inform you that the status of the transaction has been updated. Below are the details:</p>
            <ul>
              <li><strong>Transaction Type:</strong> ${transaction?.formData?.transactionType}</li>
              <li><strong>Amount:</strong> ${transaction?.formData?.amount}</li>
              <li><strong>Delivery Address:</strong> ${transaction?.formData?.deliveryAddress}</li>
              <li><strong>New Status:</strong> ${newStatus}</li>
            </ul>
            <p>Thank you for your participation. The transaction will proceed as planned.</p>`;

    await handleSendNotificationEmail(
      recipients,
      updateTransactionSubject,
      html
    );

    res.json({
      message: "Transaction status updated successfully",
      status: 200,
    });
  } catch (error) {
    res.json({ status: 500, message: error.message || "An error occurred" });
  }
}

module.exports = {
  createTransaction,
  verifyTransaction,
  verifyTransactionDetails,
  updateTransactionStatus,
};
