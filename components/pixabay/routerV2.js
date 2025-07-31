const express = require("express");
const pixabayController = require("./controllerV2");

const router = express.Router();

router
  .get("/photos", pixabayController.searchPhotos)
  .get("/photo", pixabayController.getPhoto);

module.exports = router;
