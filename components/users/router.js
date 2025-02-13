const express = require("express");
const multer = require("multer");

const upload = multer();

const userController = require("./controller");
const { authenticateToken } = require("../../middlewares/middleware");

const router = express.Router();

router
  .post("/signup", userController.createNewUser)
  .post("/login", userController.loginUser)
  .post("/logout", userController.logoutUser)
  .post("/refresh", userController.refreshToken)
  .get(
    "/favourite-images",
    authenticateToken,
    userController.getFavouriteImages
  )
  .delete(
    "/removeFavouriteImage",
    authenticateToken,
    userController.removeFavouriteImage
  )
  .patch("/update", authenticateToken, userController.updateUser)
  .post(
    "/updateProfilePic",
    authenticateToken,
    upload.single("file"),
    userController.updateProfilePic
  )
  .get("/ownAccountInfo", authenticateToken, userController.getOwnAccountInfo);

module.exports = router;
