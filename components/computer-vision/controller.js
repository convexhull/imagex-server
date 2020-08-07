const axios = require("axios");

const getSimilarImages = async (req, res) => {
  const base64Image = req.file.buffer.toString("base64");

  console.log(base64Image);
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

    let similarImagesURL = `https://api.shutterstock.com/v2/cv/similar/images?asset_id=${upload_id}`;
    let similarImagesResponse = await axios.get(similarImagesURL, {
      headers: {
        Authorization: process.env.COMPUTER_VISION_TOKEN,
      },
    });

    res.send(similarImagesResponse.data);
  } catch (e) {
    console.log(e);
  }
};

module.exports = {
  getSimilarImages,
};
