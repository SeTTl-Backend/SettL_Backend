const jwt = require("jsonwebtoken");
const hashedData = require("../../utils/hashedData");
const verifyHashedData = require("../../utils/verifyHashedData");

// Models
const userModel = require("./model");
const transactionModel = require("../transaction/model");
const OtpModel = require("../otp-verification/model");

function getAllUsers(req, res) {
  userModel
    .find()
    .then((users) => {
      res.json({
        data: {
          users: users,
        },
        status: 200,
        message: "Users fetched successfully",
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
}

async function registerUser(req, res) {
  const user = req.body;
  const email = user.email;
  const password = user.password;
  const role = user.role;
  const otp = user.otp;
  try {
    const existingUser = await userModel.find({ email });

    if (existingUser.length) {
      return res.json({
        status: 400,
        message: "User with the provided email already exists",
      });
    }

    const otpResponse = await OtpModel.find({ email })
      .sort({ createdAt: -1 })
      .limit(1);
    if (otpResponse.length === 0 || otp !== otpResponse[0].otp) {
      return res.json({
        status: 400,
        message: "The OTP is not valid",
      });
    }

    const hashedPassword = await hashedData(password); // password handling
    user.lastUpdateAt = new Date(); // set the lastUpdateAt to the current date

    const newUser = new userModel({
      firstName: user.firstName,
      lastName: user.lastName,
      email: email,
      role: role,
      password: hashedPassword,
    });

    const createdUser = await newUser.save();

    // TO DO: send a welcome mail notification to the user

    res.json({
      data: createdUser,
      status: 201,
      message: "User created successfully",
    });
  } catch (err) {
    console.log(err, err.message);
    res.status(500).json({
      message: err.message,
      status: 500,
    });
  }
}

async function authenticateUser(req, res) {
  const { email, password } = req.body;
  try {
    const fetchedUser = await userModel.find({ email });
    if (!fetchedUser?.length) {
      return res.json({
        message: "Invalid credentials entered",
        status: 401,
      });
    }
    const hashedPassword = fetchedUser[0].password;
    const fetchedUserId = fetchedUser[0]._id;
    const passwordMatch = await verifyHashedData(password, hashedPassword);

    if (!passwordMatch) {
      return res.json({
        message: "Invalid password entered",
        status: 401,
      });
    }

    const token = jwt.sign({ userId: fetchedUserId }, "your-secret-key", {
      expiresIn: "1h",
    });

    // TO DO: send a sign in alert mail notification to the user

    res.json({
      data: {
        user: fetchedUser,
        token: token,
      },
      message: "Signed in successfully",
      status: 200,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: err.message,
      status: 500,
    });
  }
}

async function getUserById(req, res) {
  try {
    const userId = req.params.userId;
    const user = await userModel.findById(userId);

    if (!user) {
      return res.json({
        status: 401,
        message: "User not found",
      });
    }

    let transactions;

    if (user?.role === "seller") {
      transactions = await transactionModel.findById({ sellerId: userId });
    }

    if (user?.role === "buyer") {
      transactions = await transactionModel.findById({ buyerId: userId });
    }

    return res.json({
      status: 200,
      message: "User fetched successfully",
      data: {
        user,
        transactions,
      },
    });
  } catch (err) {
    res.json({
      status: 500,
      message: err.message,
    });
  }
}

module.exports = {
  getAllUsers,
  registerUser,
  authenticateUser,
  getUserById,
};
