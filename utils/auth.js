const jwt = require("jsonwebtoken");
const {
  ACCESS_TOKEN_JWT_EXPIRATION_TIME,
  REFRESH_TOKEN_JWT_EXPIRATION_TIME,
} = require("./constants");

const generateAuthToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_TOKEN_SECRET, {
    expiresIn: ACCESS_TOKEN_JWT_EXPIRATION_TIME,
  });
};

const generateRefreshToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_REFRESH_TOKEN_SECRET, {
    expiresIn: REFRESH_TOKEN_JWT_EXPIRATION_TIME,
  });
};

module.exports = {
  generateAuthToken,
  generateRefreshToken,
};
