const bcrypt = require("bcrypt");

const encryptPassword = async (password) => {
  const ROUNDS = 12;
  return await bcrypt.hash(password, ROUNDS);
};

// Todo: bad naming, it's not decryption
const decryptPassword = async (password, hash) => {
  return await bcrypt.compare(password, hash);
};

module.exports = {
  encryptPassword,
  decryptPassword,
};
