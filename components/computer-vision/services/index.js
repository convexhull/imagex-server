const axios = require("axios");

const uploadImage = async (req, res) => {
  const base64Image = req.file.buffer.toString("base64");
  let imageUploadURL = `https://api.shutterstock.com/v2/cv/images`;
  let imageUploadData = {
    base64_image: base64Image,
  };
  let imageUploadConfig = {
    headers: {
      Authorization: `Bearer ${process.env.COMPUTER_VISION_TOKEN}`,
    },
  };
  try {
    let imageUploadResponse = await axios.post(
      imageUploadURL,
      imageUploadData,
      imageUploadConfig
    );
    let upload_id = imageUploadResponse.data.upload_id;
    return upload_id;
  } catch (e) {
    console.log(e.message);
    res.status(500).send(e.message);
  }
};

const getSimilarImages = async (req) => {
  let upload_id = await uploadImage(req);
  let page = req.query.page;
  try {
    let similarImagesURL = `https://api.shutterstock.com/v2/cv/similar/images?asset_id=${upload_id}&page=${page}&view=full`;
    let similarImagesResponse = await axios.get(similarImagesURL, {
      headers: {
        Authorization: `Bearer ${process.env.COMPUTER_VISION_TOKEN}`,
      },
    });
    let similarImagesData = similarImagesResponse.data;
    let total_pages = Math.ceil(
      similarImagesData.total_count / similarImagesData.per_page
    );
    similarImagesData.moreResults = total_pages <= page ? false : true;
    return similarImagesData;
  } catch (e) {
    console.log(e.message);
    throw e;
  }
};

module.exports = {
  getSimilarImages,
  uploadImage,
};
