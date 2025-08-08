const dbService = require("./db.service");
const AuthUtils = require("../../../utils/auth");
const cloudinary = require("../../../utils/cloudinary");
const jwt = require("jsonwebtoken");
const User = require("../model");
const { AppError } = require("../../../utils/error");

const PROFILE_PIC_PLACEHOLDER =
  "https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909__480.png";

const getAllUsers = async () => {
  const users = await User.find();
  return users;
};

const createNewUser = async (payload) => {
  const {
    email,
    userName,
    firstName,
    password,
    lastName,
    passwordConfirm,
    passwordChangedAt,
  } = payload.body;
  const userObj = {
    email,
    userName,
    firstName,
    password,
    passwordConfirm,
    lastName,
    profilePicUrl: PROFILE_PIC_PLACEHOLDER,
    passwordChangedAt,
  };

  const createdUser = await dbService.insertUser(userObj);
  createdUser.password = undefined;
  return createdUser;
};

const filterUpdateObj = (obj, allowedFields) => {
  const updateObj = {};
  Object.keys(obj).forEach((key) => {
    if (allowedFields.includes(key)) updateObj[key] = obj[key];
  });
  return updateObj;
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
  let updatedUser = await dbService.updateUser(criteria, updateObj, options);
  updatedUser = updatedUser.toObject();
  delete updatedUser.password;
  return updatedUser;
};

const loginUser = async (payload) => {
  const { email, password } = payload.body;
  const criteria = {
    email,
  };
  let user = await User.findOne(criteria).select("+password");
  const candidatePassword = password;

  if (!user || !(await user.checkCorrectPassword(candidatePassword))) {
    throw new AppError("WRONG_CREDENTIALS OR EMAIL_DOESNOT_EXIST", 401);
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

  user.token = token;
  user.refreshToken = refreshToken;
  user.password = undefined;
  return user;
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
        const newAccessToken = AuthUtils.generateAuthToken({
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
  let result = await dbService.aggregateUsers(aggregationPipeline);
  let images = result[0].favouriteImages;
  const image = images.find((image) => image._id.toString() === imageId);
  if (!image) {
    throw new Error(`No image with imageId: ${imageId}`);
  }
  return image;
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
  let result = await dbService.aggregateUsers(aggregationPipeline);
  let images = result[0].favouriteImages;
  return images;
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
  let updatedUser = await dbService.updateUser(criteria, updateObj, options);
  updatedUser = updatedUser.toObject();
  delete updatedUser.password;
  return updatedUser;
};

const updateProfilePic = async (image, user) => {
  let criteria = {
    email: user.email,
  };
  const base64Image = image.buffer.toString("base64");
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
};

const getOwnAccountInfo = async (currentUser) => {
  let criteria = {
    email: currentUser.email,
  };
  const user = await dbService.findOneUser(criteria);
  return user;
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
  let updatedUser = await dbService.updateUser(criteria, updateObject, options);
  return updatedUser;
};

const updateMe = async (currentUser, payload) => {
  const updateObj = { ...payload };
  const filteredUpdateObj = filterUpdateObj(updateObj, [
    "firstName",
    "lastName",
    "userName",
  ]);
  const updatedUser = await User.findByIdAndUpdate(
    currentUser._id,
    filteredUpdateObj,
    { new: true, runValidators: true }
  );
  console.log(filteredUpdateObj, { updatedUser });
  return updatedUser;
};

const deleteMe = async (currentUser) => {
  await User.findByIdAndUpdate(currentUser._id, { $set: { active: false } });
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
  updateMe,
  getAllUsers,
  deleteMe,
};
