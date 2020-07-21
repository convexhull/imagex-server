const axios = require('axios');



const searchPhotos = async (req, res) => {
    let data = {
        success: true,
        images: null
    }
    let searchKeywords = req.query.keywords;
    let page = req.query.page;
    try {
        let apiResponse = await axios.get(`https://pixabay.com/api?key=${process.env.PIXABAY_API_KEY}&q=${searchKeywords}&page=${page}&per_page=10`);
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