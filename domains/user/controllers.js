const hashedData = require("../../utils/hashedData");
const { sendVerificationEmail } = require("../email_verification/controllers");
const verifyHashedData = require("../../utils/verifyHashedData");
const userModel = require("./model");

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
  try {
    const existingUser = await userModel.find({ email });

    if (existingUser.length) {
      res.status(200).send({
        data: [],
        status: 400,
        message: "User with the provided email already exists",
      });
    } else {
      const hashedPassword = await hashedData(password); // password handling
      user.lastUpdateAt = new Date(); // set the lastUpdateAt to the current date

      const newUser = new userModel({
        firstName: user.firstName,
        lastName: user.lastName,
        dob: user.dob,
        email: email,
        phoneNumber: user.phoneNumber,
        password: hashedPassword,
        isVerified: false,
      });

      const createdUser = await newUser.save();

      const emailData = await sendVerificationEmail(createdUser);

      if (!emailData) {
        const { _id } = createUser;
        await userModel.deleteOne({ _id });
        res.status(200).send({
          status: 400,
          message: "Something went wrong",
        });
      } else {
        res.status(201).send({
          data: emailData,
          status: 201,
          message: "Verification email sent successfully",
        });
      }
    }
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
}

async function authenticateUser(req, res) {
  const { email, password } = req.body;
  try {
    const fetchedUser = await userModel.find({ email });
    if (!fetchedUser?.length) {
      res.status(200).send({
        data: {},
        message: "Invalid credentials entered",
        status: 400,
      });
    } else {
      if (!fetchedUser[0]?.isVerified) {
        res.status(200).send({
          data: [],
          message: "Email hasn't been verified yet, check your inbox",
          status: 400,
        });
      } else {
        const hashedPassword = fetchedUser[0].password;
        const passwordMatch = await verifyHashedData(password, hashedPassword);

        if (!passwordMatch) {
          res.status(400).send({
            data: {},
            message: "Invalid password entered",
            status: 400,
          });
        } else {
          res.status(200).send({
            data: fetchedUser,
            message: "Signed in successfully",
            status: 200,
          });
        }
      }
    }
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
}

module.exports = {
  getAllUsers,
  registerUser,
  authenticateUser,
};
