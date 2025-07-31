const express = require("express");
const multer = require("multer");
const { authenticateTokenV2 } = require("../../middlewares/middleware");
const userController = require("./controllerV2");

const upload = multer();
const router = express.Router();

router
  .post("/signup", userController.createNewUser)
  .post("/login", userController.loginUser)
  .post("/logout", userController.logoutUser)
  .post("/refresh", userController.refreshToken)
  .get("/me", authenticateTokenV2, userController.getOwnAccountInfo)
  .patch("/update", authenticateTokenV2, userController.updateUser)
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
  );

module.exports = router;
