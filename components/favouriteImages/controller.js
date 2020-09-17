const imageServices = require('./services');
const userServices = require('../users/services');

const saveImage = async (req, res) => {
    let responseData = {
        success: false,
        message: "",
        data: null,
        error: null
    };
    try {
        let savedImage = await imageServices.saveImage(req.body, req.user);
        let updatedUser = await userServices.addFavouriteImage(savedImage, req.user);
        responseData.data = savedImage;
        responseData.success = true;
        responseData.error = false;
        responseData.message = "Image saved";
        res.send(responseData);
    } catch(e) {
        responseData.error = e;
        res.status(500).send(responseData);
    }   
}


module.exports = {
    saveImage
}