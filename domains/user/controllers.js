const jwt = require("jsonwebtoken");
const hashedData = require("../../utils/hashedData");
const verifyHashedData = require("../../utils/verifyHashedData");

// Models
const userModel = require("./model");
const OtpModel = require("../otp-verification/model");

function getAllUsers(req, res) {
  userModel
    .find()
    .then((users) => {
      res.send({
        data: users,
        status: 200,
        message: "Users fetched successfully",
      });
    })
    .catch((err) => {
      console.log(err);
      res.send(err);
    });
}

async function registerUser(req, res) {
  const user = req.body;
  const email = user.email;
  const password = user.password;
  const otp = user.otp;
  try {
    const existingUser = await userModel.find({ email });

    if (existingUser.length) {
      return res.status(400).send({
        status: 400,
        message: "User with the provided email already exists",
      });
    }

    const otpResponse = await OtpModel.find({ email })
      .sort({ createdAt: -1 })
      .limit(1);
    if (otpResponse.length === 0 || otp !== otpResponse[0].otp) {
      return res.status(400).send({
        status: 400,
        message: "The OTP is not valid",
      });
    }

    const hashedPassword = await hashedData(password); // password handling
    user.lastUpdateAt = new Date(); // set the lastUpdateAt to the current date

    const newUser = new userModel({
      firstName: user.firstName,
      lastName: user.lastName,
      dob: user.dob,
      email: email,
      phoneNumber: user.phoneNumber,
      password: hashedPassword,
    });

    const createdUser = await newUser.save();

    res.status(201).send({
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
      return res.status(401).json({
        message: "Invalid credentials entered",
        status: 401,
      });
    }
    const hashedPassword = fetchedUser[0].password;
    const fetchedUserId = fetchedUser[0]._id;
    const passwordMatch = await verifyHashedData(password, hashedPassword);

    if (!passwordMatch) {
      return res.status(401).json({
        message: "Invalid password entered",
        status: 401,
      });
    }

    const token = jwt.sign({ userId: fetchedUserId }, "your-secret-key", {
      expiresIn: "1h",
    });

    res.status(200).send({
      data: fetchedUser,
      token: token,
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

module.exports = {
  getAllUsers,
  registerUser,
  authenticateUser,
};
