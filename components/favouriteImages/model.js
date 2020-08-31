const mongoose = require('mongoose');


const Schema = mongoose.Schema;


const imageSchema = Schema({
    platform: { type: String}, 
    pageUrl: { type: String },
    largeImageUrl: { type: String },
    mediumImageUrl: { type: String },
    smallImageUrl: { type: String },
    downloadUrl: { type: String },
    imageId: { type: String },
    createdAt: { type: Date, default: Date.now}
});


module.exports = mongoose.model("Image", imageSchema);