const Unsplash = require("unsplash-js").default;
const { toJson } = require("unsplash-js");
const axios = require("axios");

const unsplash = new Unsplash({
  accessKey: process.env.UNSPLASH_API_ACCESS_KEY,
});

const searchPhotos = (payload) => {
  return new Promise((resolve, reject) => {
    let searchKeywords = payload.keywords;
    let page = payload.page;
    unsplash.search
      .photos(searchKeywords, page, 10)
      .then(toJson)
      .then((jsonResponse) => {
        resolve(jsonResponse);
      })
      .catch((e) => {
        console.log(e);
        reject(e);
      });
  });
};

const getRandomPhoto = async () => {
  return new Promise((resolve, reject) => {
    unsplash.photos
      .getRandomPhoto({})
      .then(toJson)
      .then((json) => {
        resolve(json);
      })
      .catch((e) => {
        reject(e);
      });
  });
};

const getPhotoById = async (payload) => {
  const { id } = payload;
  try {
    const response = await axios.get(`https://api.unsplash.com/photos/${id}`, {
      headers: {
        Authorization: `Client-ID ${process.env.UNSPLASH_API_ACCESS_KEY}`,
      },
    });
    const data = response.data;
    return data;
  } catch (e) {
    throw e;
  }
};

module.exports = {
  searchPhotos,
  getRandomPhoto,
  getPhotoById,
};
