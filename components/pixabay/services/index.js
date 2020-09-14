const axios = require('axios');


const searchPhotos = async (payload) => {
    let searchKeywords = payload.keywords;
    let page = payload.page;
    let per_page = 10;
    try {
        let apiResponse = await axios.get(`https://pixabay.com/api?key=${process.env.PIXABAY_API_KEY}&q=${searchKeywords}&page=${page}&per_page=${per_page}`);
        let apiResponseData = apiResponse.data;
        let totalPages = Math.ceil(apiResponseData.totalHits / per_page); 
        let moreResults = (totalPages <= page ? false : true);
        apiResponseData.moreResults = moreResults;
        return apiResponseData;
    } catch(e) {
        throw e;
    }
}


module.exports = {
    searchPhotos
};