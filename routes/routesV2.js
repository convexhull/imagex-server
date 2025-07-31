const express = require("express");
const unsplashRouter = require("../components/unsplash/routerV2");
const pixabayRouter = require("../components/pixabay/routerV2");
const computerVisionRouter = require("../components/computer-vision/routerV2");
const userRouter = require("../components/users/routerV2");

const router = express.Router();

router.use("/users", userRouter);
router.use("/unsplash", unsplashRouter);
router.use("/pixabay", pixabayRouter);
router.use("/computer-vision", computerVisionRouter);

module.exports = router;
