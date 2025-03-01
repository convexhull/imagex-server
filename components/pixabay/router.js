const express = require("express");
const pixabayController = require("./controller");

const router = express.Router();

router
  .get("/searchPhotos", pixabayController.searchPhotos)
  .get("/photo", pixabayController.getPhotoById);

module.exports = router;
