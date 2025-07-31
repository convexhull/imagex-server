const express = require("express");
const multer = require("multer");
const computerVisionController = require("./controllerV2");

const router = express.Router();
const upload = multer();

router
  .post("/upload", upload.single("file"), computerVisionController.uploadImage)
  .get("/similar-images", computerVisionController.getSimilarImages);

module.exports = router;
