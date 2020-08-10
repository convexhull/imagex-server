const express = require('express');
const multer = require('multer');
const upload = multer();


const computerVisionController = require('./controller');
const controller = require('./controller');
const router = express.Router();


router
    .post('/uploadImage', upload.single('file'), computerVisionController.uploadImage)
    .get('/getSimilarImages', computerVisionController.getSimilarImages)

module.exports = router;

