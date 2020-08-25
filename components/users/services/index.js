const dbService = require('./db.service');
const AuthUtils = require('../../../utils/auth');


const createNewUser = async(payload, data) => {
    let userObj = {
        email : payload.body.email,
        userName : payload.body.userName,
        password : payload.body.password,
        firstName: payload.body.firstName,
        lastName: payload.body.lastName
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



const addFavouriteImage = async (image, user) => {
    let criteria = {
        email: user.email
    };
    let updateObj = {
        "$push" : {
            favouriteImages: image._id
        }
    };
    let options = {
        new: true,
        upsert: true
    };
    try {   
        let updatedUser = await dbService.updateUser(criteria, updateObj, options);
        return updatedUser;
    } catch(e) {
        throw e;
    }
}




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



const getFavouriteImages = async (user) => {
    let aggregationPipeline = [
        {
            "$lookup" : {
                "from" : "images",
                "localField" : "favouriteImages",
                "foreignField": "_id",
                "as": "favouriteImagesl"
            }
        }
    ];
    try {
        let data = await dbService.aggregateUsers(aggregationPipeline);
        console.log(JSON.stringify(data,null,2));
    } catch(e) {
        console.log(e);
    }

}


module.exports = {
    createNewUser,
    addFavouriteImage,
    loginUser,
    getFavouriteImages
}