const jwt = require('jsonwebtoken');

const generateAuthToken = (payload) => {
    return jwt.sign(payload, process.env.JWT_TOKEN_SECRET, { expiresIn : '1h'});
}


module.exports = {
    generateAuthToken
}