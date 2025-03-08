const {
  REFRESH_TOKEN_COOKIE_EXPIRATION_TIME,
  ACCESS_TOKEN_COOKIE_EXPIRATION_TIME,
} = require("../../utils/constants");
const userService = require("./services");
const services = require("./services");

const createNewUser = async (req, res) => {
  let apiResponse = {
    success: true,
    error: false,
    message: ``,
    data: null,
  };

  let payload = { ...req };

  try {
    let createdUser = await userService.createNewUser(payload);
    res.send({
      ...apiResponse,
      message: "User was created successfully",
      data: { createdUser },
    });
  } catch (e) {
    console.log(e);
    switch (e.message) {
      case "USER_ALREADY_EXISTS":
        res.status(409);
    }
    res.send({
      ...apiResponse,
      success: false,
      error: true,
      message: e.message,
    });
  }
};

const loginUser = async (req, res) => {
  let apiResponse = {
    success: true,
    error: false,
    message: ``,
    data: null,
  };
  let payload = { ...req };
  try {
    let user = await userService.loginUser(payload);
    res.cookie("refreshToken", user.refreshToken, {
      //TODO: Secure, prod env, etc.
      maxAge: REFRESH_TOKEN_COOKIE_EXPIRATION_TIME,
      httpOnly: true,
    });
    res.cookie("accessToken", user.token, {
      maxAge: ACCESS_TOKEN_COOKIE_EXPIRATION_TIME,
      httpOnly: true,
    });
    delete user.token;
    delete user.refreshToken;
    res.send(user);
  } catch (e) {
    switch (e.message) {
      case "EMAIL_DOESNOT_EXIST":
        res.status(403);
        break;
      case "WRONG_CREDENTIALS":
        res.status(401);
        break;
      default:
        res.status(500);
    }
    res.send({
      ...apiResponse,
      success: false,
      error: true,
      message: e.message,
    });
  }
};

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
    res.cookie("accessToken", session.accessToken, {
      maxAge: ACCESS_TOKEN_COOKIE_EXPIRATION_TIME,
      httpOnly: true,
    });
    delete session.accessToken;
    apiResponse = {
      ...apiResponse,
      message: "Access token generated successfully",
      data: session,
    };
  } catch (e) {
    if (e.message === "INVALID_REFRESH_TOKEN") {
      res.clearCookie("refreshToken");
      res.clearCookie("accessToken");
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
  res.clearCookie("refreshToken");
  res.clearCookie("accessToken");
  responseData.message = "Logged out successfully";
  res.status(200).json(responseData);
};

const getFavouriteImages = async (req, res) => {
  let responseData = {
    success: true,
    error: false,
    message: ``,
    data: null,
  };
  try {
    let favouriteImages = await services.getFavouriteImages(req.user);
    responseData.data = favouriteImages;
    responseData.message = "Images fetched successfully";
    res.send(responseData);
  } catch (e) {
    responseData = {
      success: false,
      error: true,
      message: "Some error occurred",
    };
    res.status(500).send(responseData);
  }
};

const updateUser = async (req, res) => {
  let responseData = {
    success: false,
    error: false,
    message: "",
    data: null,
  };
  try {
    let updateUser = await services.updateUserProfile(req);
    responseData = {
      success: true,
      error: false,
      message: "User updated successfully",
      data: updateUser,
    };
    res.send(responseData);
  } catch (e) {
    console.log(e);
    responseData = {
      success: false,
      error: true,
      message: "Some error occurred in updating",
    };
    res.status(500).send(responseData);
  }
};

const updateProfilePic = async (req, res) => {
  let responseData = {
    success: false,
    error: false,
    message: "",
    data: null,
  };
  try {
    let updatedUser = await services.updateProfilePic(req.file, req.user);
    responseData = {
      success: true,
      error: false,
      message: "Profile pic updated successfully",
      data: updatedUser,
    };
    res.send(responseData);
  } catch (e) {
    res.status(500).send(e.message);
  }
};

const getOwnAccountInfo = async (req, res) => {
  let responseData = {
    success: true,
    error: false,
    message: "",
    data: null,
  };
  try {
    let user = await services.getOwnAccountInfo(req.user);
    responseData = {
      success: true,
      error: false,
      message: "User details found",
      data: user,
    };
    res.send(responseData);
  } catch (e) {
    console.log(e);
    responseData = {
      success: false,
      error: true,
      message: e.message,
    };
    res.status(500).send(responseData);
  }
};

const removeFavouriteImage = async (req, res) => {
  let responseData = {
    success: true,
    error: false,
    message: "",
    data: null,
  };
  try {
    let updatedUser = await services.removeFavouriteImage(req, req.user);
    responseData = {
      success: true,
      error: false,
      message: "Image removed",
      data: updatedUser,
    };
    res.send(responseData);
  } catch (e) {
    console.log(e);
    responseData = {
      success: false,
      error: true,
      message: e.message,
    };
    res.status(500).send(responseData);
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
};
