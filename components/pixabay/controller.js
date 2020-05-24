const axios = require('axios');



const searchPhotos = async (req, res) => {
    let data = {
        success: true,
        images: null
    }
    let searchKeywords = req.query.keywords;
    try {
        let apiResponse = await axios.get(`https://pixabay.com/api?key=${process.env.PIXABAY_API_KEY}&q=${searchKeywords}`);
        let images = apiResponse.data.hits;
        res.send({
            ...data,
            images
        });
    }
    catch(e){
        res.send(e);
    }
}




module.exports = {
    searchPhotos
}