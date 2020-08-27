const express = require('express');



const userController = require('./controller');
const {authenticateToken} = require('../../middlewares/middleware');

const router = express.Router();


router
    .post('/signup', userController.createNewUser)
    .post('/login', userController.loginUser)
    .get('/favourite-images', authenticateToken,  userController.getFavouriteImages)
    .put('/update', authenticateToken, userController.updateUser)


module.exports = router;