const mongoose = require('mongoose');


const Schema = mongoose.Schema;

const UserSchema = Schema({
    userName : { type : String },
    email : { type : String},
    password : { type : String},
    name : { type : String}
});


module.exports = mongoose.model("User", UserSchema);