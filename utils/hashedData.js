const bcrypt = require("bcrypt");

const hashedData = async (data, saltRounds = 10) => {
  try {
    const hashedData = await bcrypt.hash(data, saltRounds);
    return hashedData;
  } catch (error) {
    throw error;
  }
};

module.exports = hashedData;
