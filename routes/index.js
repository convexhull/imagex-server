var express = require("express");

const userRouter = require("../components/users/router");
const unsplashRouter = require("../components/unsplash/router");
const pixabayRouter = require("../components/pixabay/router");
const computerVisionRouter = require("../components/computer-vision/router");
const favouriteImagesRouter = require("../components/favouriteImages/router");

var router = express.Router();

router.get("/ping", (req, res) => {
  res.send({
    reply: "pong",
  });
});

router.use("/users", userRouter);
router.use("/unsplash", unsplashRouter);
router.use("/pixabay", pixabayRouter);
router.use("/computer-vision", computerVisionRouter);
router.use("/image-list", favouriteImagesRouter);

module.exports = router;
