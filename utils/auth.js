const jwt = require('jsonwebtoken');

const generateAuthToken = (payload) => {
    return jwt.sign(payload, process.env.JWT_TOKEN_SECRET, { expiresIn : '3600s'});
}


module.exports = {
    generateAuthToken
}