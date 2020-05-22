var express = require('express');


const imageRouter = require('../components/image-analysis/router');
const userRouter = require('../components/users/router');
const unsplashRouter = require('../components/unsplash/router');



var router = express.Router();


router.get('/ping', (req, res) => {
  res.send({
    reply: "pong"
  })
});



router.use('/image', imageRouter);
router.use('/users', userRouter);
router.use('/unsplash', unsplashRouter);


module.exports = router;
