const UnsplashServices = require("./services/index");

const getRandomPhoto = async (req, res) => {
  let responseData = {
    success: true,
    message: "",
    data: null,
    error: null,
  };

  try {
    let apiResponse = await UnsplashServices.getRandomPhoto();
    responseData = {
      success: true,
      message: "Successful",
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
  }
};

const searchPhotos = async (req, res) => {
  try {
    const unsplashApiResponse = await UnsplashServices.searchPhotos(req.query);
    const responseData = {
      status: "success",
      data: {
        meta_data: {
          total: unsplashApiResponse.total,
          total_pages: unsplashApiResponse.total_pages,
        },
        photos: unsplashApiResponse.results,
      },
    };
    res.json(responseData);
  } catch (e) {
    console.log(e);
    responseData = {
      success: false,
      message: "Some error occurred",
      error: e,
    };
    res.json(responseData);
  }
};

const getPhoto = async (req, res) => {
  let responseData = {
    success: true,
    message: "",
    data: null,
    error: null,
  };

  try {
    let unsplashApiResponse = await UnsplashServices.getPhotoById(req.query);
    responseData = {
      success: true,
      message: "Successful request",
      data: unsplashApiResponse,
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
  getRandomPhoto,
  searchPhotos,
  getPhoto,
};
