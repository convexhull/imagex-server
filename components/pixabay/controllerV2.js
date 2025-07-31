const PixabayServices = require("./services/index");

const searchPhotos = async (req, res, next) => {
  try {
    const apiResponse = await PixabayServices.searchPhotos(req.query);
    const responseData = {
      status: "success",
      data: {
        meta_data: {
          total: apiResponse.total,
          totalHits: apiResponse.totalHits,
          moreResults: apiResponse.moreResults,
        },
        images: apiResponse.hits,
      },
    };
    res.json(responseData);
  } catch (err) {
    next(err);
  }
};

const getPhoto = async (req, res, next) => {
  //TODO: Fix not found, invalid id in all routes
  try {
    const apiResponse = await PixabayServices.getPhotoById(req.query);
    const responseData = {
      status: "success",
      data: {
        image: apiResponse,
      },
    };
    res.json(responseData);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  searchPhotos,
  getPhoto,
};
