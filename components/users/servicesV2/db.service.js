const Users = require("../model");

function insertUser(user) {
  let objToSave = new Users(user);
  return objToSave.save();
}

function findOneUser(criteria, projection, options) {
  return Users.findOne(criteria, projection, options);
}

function updateUser(criteria, updateObject, options) {
  return Users.findOneAndUpdate(criteria, updateObject, options);
}

function aggregateUsers(pipeline) {
  return Users.aggregate(pipeline);
}

module.exports = {
  insertUser,
  findOneUser,
  updateUser,
  aggregateUsers,
};
