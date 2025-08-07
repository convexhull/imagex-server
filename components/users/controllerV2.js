const {
  REFRESH_TOKEN_COOKIE_EXPIRATION_TIME,
  ACCESS_TOKEN_COOKIE_EXPIRATION_TIME,
} = require("../../utils/constants");
const userService = require("./servicesV2");
const services = require("./services");
const getCookiesOptions = require("../../utils/cookies");

const createNewUser = async (req, res, next) => {
  const payload = { ...req };
  try {
    const createdUser = await userService.createNewUser(payload);
    const responseData = {
      status: "success",
      data: {
        user: createdUser,
      },
    };
    res.json(responseData);
  } catch (err) {
    next(err);
  }
};

const loginUser = async (req, res, next) => {
  const payload = { ...req };
  try {
    const user = await userService.loginUser(payload);
    res.cookie(
      "refreshToken",
      user.refreshToken,
      getCookiesOptions(REFRESH_TOKEN_COOKIE_EXPIRATION_TIME)
    );
    res.cookie(
      "accessToken",
      user.token,
      getCookiesOptions(ACCESS_TOKEN_COOKIE_EXPIRATION_TIME)
    );
    delete user.token;
    delete user.refreshToken;
    const responseData = {
      status: "success",
      data: {
        user,
      },
    };
    res.json(responseData);
  } catch (err) {
    //TODO: Remember these cases when implement global error handler
    // switch (e.message) {
    //   case "EMAIL_DOESNOT_EXIST":
    //     res.status(403);
    //     break;
    //   case "WRONG_CREDENTIALS":
    //     res.status(401);
    //     break;
    //   default:
    //     res.status(500);
    // }
    // res.send({
    //   ...apiResponse,
    //   success: false,
    //   error: true,
    //   message: e.message,
    // });
    next(err);
  }
};

//TODO: refreshtoken and logout success response
const refreshToken = async (req, res) => {
  let apiResponse = {
    success: true,
    error: false,
    message: ``,
    data: null,
  };
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken)
    return res.status(401).json({ message: "No refresh token" });
  try {
    const session = await userService.refreshToken(refreshToken);
    res.cookie(
      "accessToken",
      session.accessToken,
      getCookiesOptions(ACCESS_TOKEN_COOKIE_EXPIRATION_TIME)
    );
    delete session.accessToken;
    apiResponse = {
      ...apiResponse,
      message: "Access token generated successfully",
      data: session,
    };
  } catch (e) {
    if (e.message === "INVALID_REFRESH_TOKEN") {
      res.clearCookie("refreshToken", getCookiesOptions());
      res.clearCookie("accessToken", getCookiesOptions());
    }
    apiResponse = {
      ...apiResponse,
      success: false,
      error: true,
      message: e.message,
    };
  }
  res.json(apiResponse);
};

const logoutUser = async (req, res) => {
  let responseData = {
    success: true,
    error: false,
    message: ``,
    data: null,
  };
  res.clearCookie("refreshToken", getCookiesOptions());
  res.clearCookie("accessToken", getCookiesOptions());
  responseData.message = "Logged out successfully";
  res.status(200).json(responseData);
};

const getFavouriteImage = async (req, res, next) => {
  try {
    if (!req.query.imageId) throw new Error("No imageId provided");
    const image = await services.getFavouriteImage(req.user, req.query.imageId);
    const responseData = {
      status: "success",
      data: {
        image,
      },
    };
    res.json(responseData);
  } catch (err) {
    next(err);
  }
};

const getFavouriteImages = async (req, res, next) => {
  try {
    const favouriteImages = await services.getFavouriteImages(req.user);
    const responseData = {
      status: "success",
      data: {
        images: favouriteImages,
      },
    };
    res.json(responseData);
  } catch (err) {
    next(err);
  }
};

const updateUser = async (req, res, next) => {
  try {
    let updatedUser = await services.updateUserProfile(req);
    const responseData = {
      status: "success",
      data: {
        user: updatedUser,
      },
    };
    res.json(responseData);
  } catch (err) {
    next(err);
  }
};

const updateProfilePic = async (req, res, next) => {
  try {
    const updatedUser = await services.updateProfilePic(req.file, req.user);
    const responseData = {
      status: "success",
      data: {
        user: updatedUser,
      },
    };
    res.json(responseData);
  } catch (err) {
    next(err);
  }
};

const getOwnAccountInfo = async (req, res, next) => {
  try {
    const currentUser = await services.getOwnAccountInfo(req.user);
    const responseData = {
      status: "success",
      data: {
        currentUser,
      },
    };
    res.json(responseData);
  } catch (err) {
    next(err);
  }
};

const removeFavouriteImage = async (req, res, next) => {
  try {
    const updatedUser = await services.removeFavouriteImage(req, req.user);
    const responseData = {
      status: "success",
      data: {
        user: updatedUser,
      },
    };
    res.json(responseData);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createNewUser,
  loginUser,
  logoutUser,
  refreshToken,
  getFavouriteImages,
  updateUser,
  updateProfilePic,
  getOwnAccountInfo,
  removeFavouriteImage,
  getFavouriteImage,
};
