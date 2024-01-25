const jwt = require("jsonwebtoken");

async function VerifyTokenMW(req, res, next) {
  const token = req.header("Authorization");
  if (!token)
    return res.status(401).json({ message: "Access Denied", status: 401 });
  try {
    const decoded = jwt.verify(token, "your-secret-key");
    req.userId = decoded.userId;
    next();
  } catch (error) {
    next({
      message: error.details[0].message,
      status: 400,
    });
  }
}

module.exports = {
  VerifyTokenMW,
};
