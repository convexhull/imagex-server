const dbService = require('./db.service');
const AuthUtils = require('../../../utils/auth');
const cloudinary = require('../../../utils/cloudinary');
const { update } = require('../model');


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
            "$match" : {
                "email" : user.email
            }
        },
        {
            "$lookup" : {
                "from" : "images",
                "localField" : "favouriteImages",
                "foreignField": "_id",
                "as": "favouriteImages"
            }
        }
    ];
    try {
        let result = await dbService.aggregateUsers(aggregationPipeline);
        let images = result[0].favouriteImages;
        return images;
    } catch(e) {
        console.log(e);
        throw e;
    }
}

const updateUserProfile = async (req) => {
    let user = req.user;
    let criteria = {
        email: user.email
    };
    let valuesToSet = {};
    if(req.body.firstName){
        valuesToSet.firstName = req.body.firstName;
    }
    if(req.body.lastName){
        valuesToSet.lastName = req.body.lastName;
    }
    // if(req.body.email){
    //     valuesToSet.email = req.body.email;
    // }
    if(req.body.userName){
        valuesToSet.userName = req.body.userName;
    }
    if(req.body.password){
        valuesToSet.password = req.body.password;
    }
    if(req.body.bio){
        valuesToSet.bio = req.body.bio;
    }
    let updateObj = {
      "$set": valuesToSet
    };
    let options = {
        new: true
    };
    try {
        let updatedUser = await dbService.updateUser(criteria, updateObj, options);
        return updatedUser;
    } catch(e) {
        throw e;
    }
}




const updateProfilePic = async(image, user) => {
    let criteria = {
        email: user.email
    };
    const base64Image = image.buffer.toString("base64");
    try {
        let cloudinaryResponse = await cloudinary.uploadToCloud(base64Image);
        let updateObj = {
            "$set" : {
                profilePicUrl:  cloudinaryResponse.url
            }
        };
        let options = {
            new: true
        };
        let updatedUser = await dbService.updateUser(criteria, updateObj, options);
        return updatedUser;
    } catch(e){
        throw e;
    }
}


const getOwnAccountInfo = async(user) => {
    let criteria = {
        email: user.email
    };
    try {
        let user = await dbService.findOneUser(criteria);
        return user;
    } catch(e) {
        throw e;
    }
}

module.exports = {
    createNewUser,
    addFavouriteImage,
    loginUser,
    getFavouriteImages,
    updateUserProfile,
    updateProfilePic,
    getOwnAccountInfo
}


