const express = require("express");
const unsplashRouter = require("../components/unsplash/routerV2");
const pixabayRouter = require("../components/pixabay/routerV2");

const router = express.Router();

router.use("/unsplash", unsplashRouter);
router.use("/pixabay", pixabayRouter);

module.exports = router;
