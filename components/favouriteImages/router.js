const express = require("express");
const imageController = require("./controller");
const middlewares = require("../../middlewares/middleware");

const router = express.Router();

router.post(
  "/saveImage",
  middlewares.authenticateTokenV2,
  imageController.saveImage
);

module.exports = router;
