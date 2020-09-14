const Unsplash = require('unsplash-js').default;
const { toJson } = require('unsplash-js');
const fetch = require('node-fetch');
global.fetch = fetch;

const unsplash = new Unsplash({ accessKey: process.env.UNSPLASH_API_ACCESS_KEY });



const searchPhotos = (payload) => {
    return new Promise( (resolve, reject) => {
        let searchKeywords = payload.keywords;
        let page = payload.page;
        unsplash.search.photos(searchKeywords, page, 10)
            .then(toJson)
            .then(jsonResponse => {
                resolve(jsonResponse);
            })
            .catch(e => {
                console.log(e);
                reject(e);
            })  
    })
}


module.exports = {
    searchPhotos
}