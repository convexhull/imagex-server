const express = require("express");
const multer = require("multer");
const { authenticateTokenV2, restrictTo } = require("../auth/authController");
const userController = require("./controllerV2");
const authController = require("../auth/authController");
const upload = multer();
const router = express.Router();

router
  .post("/signup", userController.createNewUser)
  .post("/login", userController.loginUser)
  .post("/logout", userController.logoutUser)
  .post("/refresh", userController.refreshToken)
  .get(
    "/",
    authenticateTokenV2,
    restrictTo("ADMIN"),
    userController.getAllUsers
  )
  .get("/me", authenticateTokenV2, userController.getOwnAccountInfo)
  .patch(
    "/update-my-password",
    authenticateTokenV2,
    authController.updatePassword
  )
  .patch("/update", authenticateTokenV2, userController.updateUser)
  .patch("/update-me", authenticateTokenV2, userController.updateMe)
  .patch(
    "/profile-picture",
    authenticateTokenV2,
    upload.single("file"),
    userController.updateProfilePic
  )
  .get(
    "/favourite-images",
    authenticateTokenV2,
    userController.getFavouriteImages
  )
  .delete(
    "/favourite-image",
    authenticateTokenV2,
    userController.removeFavouriteImage
  )
  .get(
    "/favourite-image",
    authenticateTokenV2,
    userController.getFavouriteImage
  )
  .delete("/delete-me", authenticateTokenV2, userController.deleteMe);

module.exports = router;
