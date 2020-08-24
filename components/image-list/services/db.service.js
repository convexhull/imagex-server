const Images = require('../model');


const insertImage = (objToSave) => {
    let document = new Images(objToSave);
    return document.save();
}

module.exports = {
    insertImage
}