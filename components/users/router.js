const express = require("express");
const multer = require("multer");

const upload = multer();

const userController = require("./controller");
const { authenticateTokenV2 } = require("../../middlewares/middleware");

const router = express.Router();

router
  .post("/signup", userController.createNewUser)
  .post("/login", userController.loginUser)
  .post("/logout", userController.logoutUser)
  .post("/refresh", userController.refreshToken)
  .get(
    "/favourite-images",
    authenticateTokenV2,
    userController.getFavouriteImages
  )
  .delete(
    "/removeFavouriteImage",
    authenticateTokenV2,
    userController.removeFavouriteImage
  )
  .patch("/update", authenticateTokenV2, userController.updateUser)
  .post(
    "/updateProfilePic",
    authenticateTokenV2,
    upload.single("file"),
    userController.updateProfilePic
  )
  .get("/ownAccountInfo", authenticateTokenV2, userController.getOwnAccountInfo)
  .get("/me", authenticateTokenV2, userController.getOwnAccountInfo)
  .get(
    "/favourite-image",
    authenticateTokenV2,
    userController.getFavouriteImage
  );

module.exports = router;
