const Unsplash = require('unsplash-js').default;
const { toJson } = require('unsplash-js');
const fetch = require('node-fetch');
global.fetch = fetch;


const unsplash = new Unsplash({ accessKey: process.env.UNSPLASH_API_ACCESS_KEY});



const getRandomPhoto = (req, res) => {
    unsplash.photos.getRandomPhoto()
        .then(toJson)
        .then(json => {
            res.send(json);
        })
        .catch(e => {
            res.send(e)
        })
}


const searchPhotos = (req, res) => {
    let data = {
        success: true,
        images: null
    }
    let searchKeywords = req.query.keywords;
    unsplash.search.photos(searchKeywords, 1, 10)
        .then(toJson)
        .then(json => {
            let images = json.results;
            res.send({
                ...data,
                images
            });
        })
        .catch(e => {
            res.send(e);
        })
}




module.exports = {
    getRandomPhoto,
    searchPhotos
}