const mongoose = require('mongoose');


const Schema = mongoose.Schema;


const UserSchema = Schema({
    userName : { type : String },
    email : { type : String},
    password : { type : String},
    firstName : { type : String},
    lastName: { type: String },
    favouriteImages: [{type: Schema.Types.ObjectId}]
});


module.exports = mongoose.model("User", UserSchema);