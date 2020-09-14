const axios = require("axios");
const CVServices = require('./services/index');

const uploadImage = async (req, res) => {
  const base64Image = req.file.buffer.toString("base64");
  let imageUploadURL = `https://api.shutterstock.com/v2/cv/images`;
  let imageUploadData = {
    base64_image: base64Image,
  };
  let imageUploadConfig = {
    headers: {
      Authorization: process.env.COMPUTER_VISION_TOKEN,
    }
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
  let responseData = {
    success: true,
    message: '',
    error: null,
    data: null
  };
  try {
    let apiResponse = await CVServices.getSimilarImages(req.query);
    responseData = {
      success: true,
      message: 'Similar images query successful',
      data: apiResponse
    };
    res.send(responseData);
  } catch (e) {
    console.log(e);
    responseData = {
      success: true,
      message: 'Some error occurred',
      error: e
    };
    res.status(500).send(responseData);
  }
};

module.exports = {
  uploadImage,
  getSimilarImages,
};
