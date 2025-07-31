const axios = require("axios");
const CVServices = require("./services/index");

const uploadImage = async (req, res, next) => {
  const base64Image = req.file.buffer.toString("base64");
  const imageUploadURL = `https://api.shutterstock.com/v2/cv/images`;
  const imageUploadData = {
    base64_image: base64Image,
  };
  const imageUploadConfig = {
    headers: {
      Authorization: `Bearer ${process.env.COMPUTER_VISION_TOKEN}`,
    },
  };
  try {
    const imageUploadResponse = await axios.post(
      imageUploadURL,
      imageUploadData,
      imageUploadConfig
    );
    const upload_id = imageUploadResponse.data.upload_id;
    res.json({
      status: "success",
      data: {
        upload_id,
      },
    });
  } catch (err) {
    next(err);
  }
};

const getSimilarImages = async (req, res, next) => {
  try {
    const apiResponse = await CVServices.getSimilarImages(req.query);
    const { page, per_page, total_count, search_id, data } = apiResponse;
    const responseData = {
      status: "success",
      data: {
        meta_data: {
          page,
          per_page,
          total_count,
          search_id,
        },
        images: data,
      },
    };
    res.json(responseData);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  uploadImage,
  getSimilarImages,
};
