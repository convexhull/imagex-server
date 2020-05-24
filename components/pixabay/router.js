const express = require('express');
const pixabayController = require('./controller');

const router = express.Router();


router
    .get('/searchPhotos', pixabayController.searchPhotos)

module.exports = router;