const dbService = require("./db.service");
const AuthUtils = require("../../../utils/auth");
const cloudinary = require("../../../utils/cloudinary");
const Hashing = require("../../../utils/hash");
const jwt = require("jsonwebtoken");

const PROFILE_PIC_PLACEHOLDER =
  "https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909__480.png";

const createNewUser = async (req) => {
  const { email, userName, firstName, password, lastName, passwordConfirm } =
    req.body;
  const userObj = {
    email,
    userName,
    firstName,
    password,
    passwordConfirm,
    lastName,
    profilePicUrl: PROFILE_PIC_PLACEHOLDER,
  };

  const createdUser = await dbService.insertUser(userObj);
  return createdUser;
};

const addFavouriteImage = async (image, user) => {
  let criteria = {
    email: user.email,
  };
  let updateObj = {
    $push: {
      favouriteImages: image._id,
    },
  };
  let options = {
    new: true,
    upsert: true,
  };
  try {
    let updatedUser = await dbService.updateUser(criteria, updateObj, options);
    updatedUser = updatedUser.toObject();
    delete updatedUser.password;
    return updatedUser;
  } catch (e) {
    throw e;
  }
};

const loginUser = async (payload, data) => {
  let criteria = {
    email: payload.body.email,
  };
  let user = {};
  try {
    user = await dbService.findOneUser(criteria);
    if (!user) {
      throw new Error("EMAIL_DOESNOT_EXIST");
    } else {
      let userPassword = user.password;
      let suppliedPassword = payload.body.password;
      let passwordMatch = await Hashing.decryptPassword(
        suppliedPassword,
        userPassword
      );
      if (!passwordMatch) {
        throw new Error("WRONG_CREDENTIALS");
      }
      const token = AuthUtils.generateAuthToken({
        email: user.email,
        userName: user.userName,
        _id: user._id,
      });
      const refreshToken = AuthUtils.generateRefreshToken({
        email: user.email,
        userName: user.userName,
        _id: user._id,
      });
      user = user.toObject();
      user.token = token;
      user.refreshToken = refreshToken;
      delete user.password;
      return user;
    }
  } catch (e) {
    throw e;
  }
};

const refreshToken = async (refreshToken) => {
  return new Promise((resolve, reject) => {
    let user = {};
    jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_TOKEN_SECRET,
      async (err, decoded) => {
        if (err) {
          return reject(new Error("INVALID_REFRESH_TOKEN"));
        }
        const { email, userName, _id } = decoded;
        const criteria = { email };
        user = await dbService.findOneUser(criteria);
        if (!user) {
          return reject(new Error("No user found"));
        }
        user = user.toObject();
        newAccessToken = AuthUtils.generateAuthToken({
          email,
          userName,
          _id,
        });
        user.accessToken = newAccessToken;
        delete user.password;
        resolve(user);
      }
    );
  });
};

const getFavouriteImage = async (user, imageId) => {
  //TODO: Improve schema or query
  let aggregationPipeline = [
    {
      $match: {
        email: user.email,
      },
    },
    {
      $lookup: {
        from: "images",
        localField: "favouriteImages",
        foreignField: "_id",
        as: "favouriteImages",
      },
    },
  ];
  try {
    let result = await dbService.aggregateUsers(aggregationPipeline);
    let images = result[0].favouriteImages;
    const image = images.find((image) => image._id.toString() === imageId);
    if (!image) {
      throw new Error(`No image with imageId: ${imageId}`);
    }
    return image;
  } catch (e) {
    console.log(e);
    throw e;
  }
};

const getFavouriteImages = async (user) => {
  let aggregationPipeline = [
    {
      $match: {
        email: user.email,
      },
    },
    {
      $lookup: {
        from: "images",
        localField: "favouriteImages",
        foreignField: "_id",
        as: "favouriteImages",
      },
    },
  ];
  try {
    let result = await dbService.aggregateUsers(aggregationPipeline);
    let images = result[0].favouriteImages;
    return images;
  } catch (e) {
    console.log(e);
    throw e;
  }
};

const updateUserProfile = async (req) => {
  let user = req.user;
  let criteria = {
    email: user.email,
  };
  let valuesToSet = {};
  if (req.body.firstName) {
    valuesToSet.firstName = req.body.firstName;
  }
  if (req.body.lastName) {
    valuesToSet.lastName = req.body.lastName;
  }
  // if(req.body.email){
  //     valuesToSet.email = req.body.email;
  // }
  if (req.body.userName) {
    valuesToSet.userName = req.body.userName;
  }
  if (req.body.password) {
    valuesToSet.password = req.body.password;
  }
  if (req.body.bio) {
    valuesToSet.bio = req.body.bio;
  }
  let updateObj = {
    $set: valuesToSet,
  };
  let options = {
    new: true,
  };
  try {
    let updatedUser = await dbService.updateUser(criteria, updateObj, options);
    updatedUser = updatedUser.toObject();
    delete updatedUser.password;
    return updatedUser;
  } catch (e) {
    throw e;
  }
};

const updateProfilePic = async (image, user) => {
  let criteria = {
    email: user.email,
  };
  const base64Image = image.buffer.toString("base64");
  try {
    let cloudinaryResponse = await cloudinary.uploadToCloud(base64Image);
    let updateObj = {
      $set: {
        profilePicUrl: cloudinaryResponse.url,
      },
    };
    let options = {
      new: true,
    };
    let updatedUser = await dbService.updateUser(criteria, updateObj, options);
    return updatedUser;
  } catch (e) {
    throw e;
  }
};

const getOwnAccountInfo = async (user) => {
  let criteria = {
    email: user.email,
  };
  try {
    let user = await dbService.findOneUser(criteria);
    return user;
  } catch (e) {
    throw e;
  }
};

const removeFavouriteImage = async (payload, user) => {
  let criteria = {
    email: user.email,
  };
  let updateObject = {
    $pull: {
      favouriteImages: payload.query.imageId,
    },
  };
  let options = {
    new: true,
  };
  try {
    let updatedUser = await dbService.updateUser(
      criteria,
      updateObject,
      options
    );
    return updatedUser;
  } catch (e) {
    throw e;
  }
};

module.exports = {
  createNewUser,
  addFavouriteImage,
  loginUser,
  refreshToken,
  getFavouriteImages,
  updateUserProfile,
  updateProfilePic,
  getOwnAccountInfo,
  removeFavouriteImage,
  getFavouriteImage,
};
