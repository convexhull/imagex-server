const express = require('express');
const multer = require('multer');
const upload = multer();


const computerVisionController = require('./controller');
const router = express.Router();


router
    .post('/getSimilarImages', upload.single('asset'), computerVisionController.getSimilarImages)

module.exports = router;

