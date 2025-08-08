const jwt = require("jsonwebtoken");
const { AppError } = require("../../utils/error");
const util = require("util");
const User = require("../users/model");
const authService = require("./authServices");

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

const restrictTo = (...roles) => {
  return (req, res, next) => {
    console.log("xxx", roles);
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError(
          "You are not authorized to do this action. Please check with admin!",
          403
        )
      );
    }
    next();
  };
};

const updatePassword = async (req, res, next) => {
  //TODO: RELOGIN. REFACTOR AND CREATE COOKIE SETTING FUNC
  const payload = { ...req.body };
  const user = await authService.updatePassword(payload, req.user);
  res.json({
    status: "success",
    data: {
      user,
    },
  });
};

module.exports = {
  authenticateTokenV2,
  restrictTo,
  updatePassword,
};
