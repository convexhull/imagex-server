const UnsplashServices = require("./services/index");

const getRandomPhoto = async (req, res, next) => {
  try {
    let apiResponse = await UnsplashServices.getRandomPhoto();
    const responseData = {
      status: "success",
      data: {
        image: apiResponse,
      },
    };
    res.send(responseData);
  } catch (err) {
    next(err);
  }
};

const searchPhotos = async (req, res, next) => {
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
  } catch (err) {
    next(err);
  }
};

const getPhoto = async (req, res, next) => {
  try {
    let unsplashApiResponse = await UnsplashServices.getPhotoById(req.query);
    const responseData = {
      status: "success",
      data: {
        image: unsplashApiResponse,
      },
    };
    res.json(responseData);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getRandomPhoto,
  searchPhotos,
  getPhoto,
};
