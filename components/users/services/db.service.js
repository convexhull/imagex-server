const Users  = require('../model');


function insertUser(user) {
    let objToSave = new Users(user);
    return objToSave.save();
}


function findOneUser(criteria, projection, options) {
    return Users.findOne(criteria, projection, options);
}


module.exports = {
    insertUser,
    findOneUser
}