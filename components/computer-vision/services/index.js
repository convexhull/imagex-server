const axios = require("axios");

const getSimilarImages = async (payload) => {
    let upload_id = payload.upload_id;
    let page = payload.page;
    try {
      let similarImagesURL = `https://api.shutterstock.com/v2/cv/similar/images?asset_id=${upload_id}&page=${page}&view=full`;
      let similarImagesResponse = await axios.get(similarImagesURL, {
        headers: {
          Authorization: process.env.COMPUTER_VISION_TOKEN,
        }
      });
      let similarImagesData = similarImagesResponse.data;
      let total_pages = Math.ceil(similarImagesData.total_count / similarImagesData.per_page);
      similarImagesData.moreResults = (total_pages <= page ? false : true );
      return similarImagesData;
    } catch (e) {
      throw e;
    }
  };



  module.exports = {
      getSimilarImages
  }