var express = require('express');


const imageRouter = require('../components/image-analysis/router');
const userRouter = require('../components/users/router');
const unsplashRouter = require('../components/unsplash/router');
const pixabayRouter = require('../components/pixabay/router');
const computerVisionRouter = require('../components/computer-vision/router');


var router = express.Router();


router.get('/ping', (req, res) => {
  res.send({
    reply: "pong"
  })
});


router.use('/image', imageRouter);
router.use('/users', userRouter);
router.use('/unsplash', unsplashRouter);
router.use('/pixabay', pixabayRouter);
router.use('/computer-vision', computerVisionRouter)


module.exports = router;
