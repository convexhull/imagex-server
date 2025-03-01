const PixabayServices = require("./services/index");

const searchPhotos = async (req, res) => {
  let responseData = {
    success: true,
    message: "",
    error: null,
    data: null,
  };
  try {
    let apiResponse = await PixabayServices.searchPhotos(req.query);
    responseData = {
      success: true,
      message: "Image Search successful",
      data: apiResponse,
    };
    res.send(responseData);
  } catch (e) {
    console.log(e);
    responseData = {
      success: false,
      message: "Some error occurred",
      error: e,
    };
    res.send(responseData);
  }
};

const getPhotoById = async (req, res) => {
  let responseData = {
    success: true,
    message: "",
    error: null,
    data: null,
  };
  try {
    let apiResponse = await PixabayServices.getPhotoById(req.query);
    responseData = {
      success: true,
      message: "Image fetched successfully",
      data: apiResponse,
    };
    res.send(responseData);
  } catch (e) {
    console.log(e);
    responseData = {
      success: false,
      message: "Some error occurred",
      error: e,
    };
    res.status(500).send(responseData);
  }
};

module.exports = {
  searchPhotos,
  getPhotoById,
};
