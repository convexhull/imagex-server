const CVServices = require("./services/index");

const findSimilarImages = async (req, res) => {
  let responseData = {
    success: true,
    message: "",
    error: null,
    data: null,
  };
  try {
    if (!req.query.page) {
      throw new Error("Page required in query");
    }
    let apiResponse = await CVServices.getSimilarImages(req);
    responseData = {
      success: true,
      message: "Similar images query successful",
      data: apiResponse,
    };
    res.send(responseData);
  } catch (e) {
    console.log(e.message);
    responseData = {
      success: true,
      message: e.message,
      error: e.toString(),
    };
    res.status(500).send(responseData);
  }
};

module.exports = {
  findSimilarImages,
};
