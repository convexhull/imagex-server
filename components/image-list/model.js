const mongoose = require('mongoose');


const Schema = mongoose.Schema;


const imageSchema = Schema({
    url: { type: String },
    platform: { type: String} , 
    imageId: { type: String },
    createdAt: { type: Date, default: Date.now }
});



module.exports = mongoose.model("Image", imageSchema);