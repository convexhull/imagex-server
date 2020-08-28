const express = require('express');
const multer = require('multer');

const upload = multer();



const userController = require('./controller');
const {authenticateToken} = require('../../middlewares/middleware');

const router = express.Router();


router
    .post('/signup', userController.createNewUser)
    .post('/login', userController.loginUser)
    .get('/favourite-images', authenticateToken,  userController.getFavouriteImages)
    .put('/update', authenticateToken, userController.updateUser)
    .post('/updateProfilePic', authenticateToken, upload.single('file'), userController.updateProfilePic)


module.exports = router;