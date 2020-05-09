const dbService = require('./db.service');
const AuthUtils = require('../../../utils/auth');


const createNewUser = async(payload, data) => {
    let userObj = {
        email : payload.body.email,
        name : payload.body.name,
        userName : payload.body.userName,
        password : payload.body.password
    };
    let createdUser = {};
    try {
        let criteria = {
            email : payload.body.email
        };
        let existingUser = await dbService.findOneUser(criteria);
        if(!existingUser){
            createdUser = await dbService.insertUser(userObj);
            createdUser = createdUser.toObject();
            createdUser.token = AuthUtils.generateAuthToken({email : payload.body.email , userName : payload.body.userName});
            return createdUser;
        } else {
            throw new Error("User already exists in the database");
        }
    }
    catch(e){
        throw e;
    }
};



const loginUser = async (payload, data) => {
    let criteria = {
        email : payload.body.email,
        password : payload.body.password
    };

    let user = {};

    try {
        user = await dbService.findOneUser(criteria);
        if(!user){
            throw new Error("EMAIL_DOESNOT_EXIST");
        }
        else {
            console.log("found user in db", user);
            const token = AuthUtils.generateAuthToken({email : user.email , userName : user.userName});
            user = user.toObject();
            user.token = token;
            return user;
        }
    }   
    catch(e){
        throw e;
    }
}


module.exports = {
    createNewUser,
    loginUser
}