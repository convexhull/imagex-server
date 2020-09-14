const axios = require("axios");

const uploadImage = async (req, res) => {
  const base64Image = req.file.buffer.toString("base64");
  let imageUploadURL = `https://api.shutterstock.com/v2/cv/images`;
  let imageUploadData = {
    base64_image: base64Image,
  };
  let imageUploadConfig = {
    headers: {
      Authorization: process.env.COMPUTER_VISION_TOKEN,
    },
  };
  try {
    let imageUploadResponse = await axios.post(
      imageUploadURL,
      imageUploadData,
      imageUploadConfig
    );
    let upload_id = imageUploadResponse.data.upload_id;
    res.send({
      upload_id
    });
  } catch (e) {
    res.status(500).send(e.message);
  }
};

const getSimilarImages = async (req, res) => {
  let upload_id = req.query.upload_id;
  let page = req.query.page;
  try {
    let similarImagesURL = `https://api.shutterstock.com/v2/cv/similar/images?asset_id=${upload_id}&page=${page}&view=full`;
    let similarImagesResponse = await axios.get(similarImagesURL, {
      headers: {
        Authorization: process.env.COMPUTER_VISION_TOKEN,
      }
    });
    console.log("xxxxxx", similarImagesResponse.data);
    res.send(similarImagesResponse.data);
  } catch (e) {
    console.log(e);
    res.status(500).send(e.message);
  }
};

module.exports = {
  uploadImage,
  getSimilarImages,
};
