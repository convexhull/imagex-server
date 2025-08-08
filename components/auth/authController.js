const jwt = require("jsonwebtoken");
const { AppError } = require("../error/errorController");
const util = require("util");
const User = require("../users/model");

const authenticateTokenV2 = async (req, res, next) => {
  // Cookie based auth

  //1) Check if token exists
  const token = req.cookies.accessToken;
  if (!token) {
    return next(new AppError("You are not logged in!", 401));
  }
  //2) Verify token signature
  const decoded = await util.promisify(jwt.verify)(
    token,
    process.env.JWT_TOKEN_SECRET
  );

  //3) Check if user still exists
  const { _id: userId, iat } = decoded;
  const currentUser = await User.findById(userId);

  if (!currentUser) {
    return next(
      new AppError("The user belonging to this token no longer exists", 401)
    );
  }

  //4) Check if user hasn't updated password after token was issued
  const hasChangedPassword = currentUser.hasChangedPasswordAfter(iat);
  if (hasChangedPassword) {
    return next(
      new AppError("User recently changed password! Please log in again", 401)
    );
  }
  // All good, grant access
  req.user = currentUser;
  next();
};

module.exports = {
  authenticateTokenV2,
};
