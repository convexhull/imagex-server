const mongoose = require('mongoose');


const Schema = mongoose.Schema;


const UserSchema = Schema({
    userName : { type : String },
    email : { type : String},
    password : { type : String},
    firstName : { type : String},
    lastName: { type: String },
    profilePicUrl: { type: String },
    favouriteImages: [{type: Schema.Types.ObjectId}],
    bio: {type: String}
});


module.exports = mongoose.model("User", UserSchema);