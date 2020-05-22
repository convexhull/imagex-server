const express = require('express');
const unsplashController = require('./controller');

const router = express.Router();


router
    .get('/randomPhoto' , unsplashController.getRandomPhoto)
    .post('/searchPhotos', unsplashController.searchPhotos)

module.exports = router;