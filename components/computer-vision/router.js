const express = require("express");
const multer = require("multer");
const upload = multer();

const computerVisionController = require("./controller");
const router = express.Router();

router.post(
  "/find-similar",
  upload.single("file"),
  computerVisionController.findSimilarImages
);

module.exports = router;
