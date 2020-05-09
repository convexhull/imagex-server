const express = require('express');
const multer  = require('multer');

var upload = multer();


const ImageController = require('./controller');
const {authenticateToken} = require('../../middlewares/middleware');


const router = express.Router();



router
    .get('/', upload.single('avatar'), authenticateToken, ImageController.uploadImage);


module.exports = router;
