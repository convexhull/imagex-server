const UnsplashServices = require('./services/index');




const getRandomPhoto = (req, res) => {
    unsplash.photos.getRandomPhoto({ orientation: "landscape" })
        .then(toJson)
        .then(json => {
            console.log("zzz", json);
            res.send(json);
        })
        .catch(e => {
            res.send(e)
        })
}


const searchPhotos = async (req, res) => {
    let apiResponse = {
        success: true,
        message: '',
        data: null,
        error: null
    };

    try {
        let unsplashApiResponse = await UnsplashServices.searchPhotos(req.query);
        apiResponse = {
            success: true,
            message: "Successful request",
            data: unsplashApiResponse
        }
        res.send(apiResponse);
    } catch(e) {
        console.log(e);
        apiResponse = {
            success: false,
            message: "Some error occurred",
            error: e
        };
        res.send(apiResponse);        
    }
    
}




module.exports = {
    getRandomPhoto,
    searchPhotos
}