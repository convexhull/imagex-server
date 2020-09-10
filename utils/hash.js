const bcrypt = require('bcrypt');


const encryptPassword = (password) => {
    const ROUNDS = 12;
    return new Promise( (resolve, reject) => {
        bcrypt.hash(password, ROUNDS, (err, hash) => {
            if(err){
                reject(err);
            } else {
                resolve(hash);
            }
        })
    })
};


const decryptPassword = (password, hash) => {
    return new Promise( (resolve, reject) => {
        bcrypt.compare(password, hash, (err, res) => {
            if(err){
                //some error in comparison
                reject(err);
            } else {
                resolve(res); //true or false
            }
        })
    })
}

module.exports = {
    encryptPassword,
    decryptPassword
}