const User = require("../users/model");
const { AppError } = require("../../utils/error");
//TODO: Rename paylaod
exports.updatePassword = async (data, currentUser) => {
  const { currentPassword, password, passwordConfirm } = data;
  const user = await User.findById(currentUser._id).select("+password");

  if (!(await user.checkCorrectPassword(currentPassword))) {
    throw new AppError("Your current password is wrong!", 401);
  }

  user.password = password;
  user.passwordConfirm = passwordConfirm;

  const savedUser = await user.save();
  savedUser.password = undefined;
  return savedUser;
};
