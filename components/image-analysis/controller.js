const imageService = require('./services');

const uploadImage = async (req, res) => {
    let apiResponse = {
        success: true,
        error: false,
        message: '',
        data : null
    };
    let payload = {...req};
    try {
        let imageLocation = await imageService.uploadImageToS3(payload);     
        res.json({
            ...apiResponse,
            data: imageLocation,
            message: "Image uploaded successfully"
        });       
    }
    catch(e){
        console.log(e);
        res.send({
            ...apiResponse,
            success: false,
            error: true,
            message: e.message
        })
    }
};


module.exports = {
    uploadImage
}