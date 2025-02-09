const jwt = require("jsonwebtoken");

const generateAuthToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_TOKEN_SECRET, {
    expiresIn: 60,
  });
};

const generateRefreshToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_REFRESH_TOKEN_SECRET, {
    expiresIn: "30d",
  });
};

module.exports = {
  generateAuthToken,
  generateRefreshToken,
};
