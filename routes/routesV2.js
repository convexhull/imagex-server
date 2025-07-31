const express = require("express");
const unsplashRouter = require("../components/unsplash/routerV2");

const router = express.Router();

router.use("/unsplash", unsplashRouter);

module.exports = router;
