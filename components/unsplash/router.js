const express = require("express");
const unsplashController = require("./controller");

const router = express.Router();

router
  .get("/randomPhoto", unsplashController.getRandomPhoto)
  .post("/searchPhotos", unsplashController.searchPhotos)
  .get("/photo", unsplashController.getPhoto);

module.exports = router;
