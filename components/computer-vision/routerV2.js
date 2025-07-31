const express = require("express");
const multer = require("multer");
const upload = multer();

const computerVisionController = require("./controller");
const router = express.Router();

router
  .post("/upload", upload.single("file"), computerVisionController.uploadImage)
  .get("/similar-images", computerVisionController.getSimilarImages);

module.exports = router;
