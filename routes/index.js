var express = require('express');


const imageRouter = require('../components/image-analysis/router');
const userRouter = require('../components/users/router');



var router = express.Router();


router.get('/ping', (req, res) => {
  res.send({
    reply: "pong"
  })
});



router.use('/image', imageRouter);
router.use('/users', userRouter);


module.exports = router;
