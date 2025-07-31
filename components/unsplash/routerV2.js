const express = require("express");
const unsplashController = require("./controllerV2");

const router = express.Router();

router.get("/photos", unsplashController.searchPhotos);
router.get("/photo", unsplashController.getPhoto);
router.get("/random-photo", unsplashController.getRandomPhoto);

module.exports = router;
