const dbService = require('./db.service');
const AuthUtils = require('../../../utils/auth');
const cloudinary = require('../../../utils/cloudinary');
const Hashing = require('../../../utils/hash');

const createNewUser = async(payload, data) => {
    let userObj = {
        email : payload.body.email,
        userName : payload.body.userName,
        password : payload.body.password,
        firstName: payload.body.firstName,
        lastName: payload.body.lastName,
        profilePicUrl: "https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909__480.png"
    };
    let createdUser = {};
    try {
        let criteria = {
            email : payload.body.email
        };
        let existingUser = await dbService.findOneUser(criteria);
        if(!existingUser){
            let password = payload.body.password;
            let hashedPassword = await Hashing.encryptPassword(password);
            userObj.password = hashedPassword;
            createdUser = await dbService.insertUser(userObj);
            createdUser = createdUser.toObject();
            createdUser.token = AuthUtils.generateAuthToken({email : payload.body.email , userName : payload.body.userName});
            delete createdUser.password;
            return createdUser;
        } else {
            throw new Error("USER_ALREADY_EXISTS");
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
        updatedUser = updatedUser.toObject();
        delete updatedUser.password;
        return updatedUser;
    } catch(e) {
        throw e;
    }
}




const loginUser = async (payload, data) => {
    let criteria = {
        email : payload.body.email
    };
    let user = {};
    try {
        user = await dbService.findOneUser(criteria);
        if(!user){
            throw new Error("EMAIL_DOESNOT_EXIST");
        }
        else {
            let userPassword = user.password;
            let suppliedPassword = payload.body.password;
            let passwordMatch = await Hashing.decryptPassword(suppliedPassword, userPassword);
            if(!passwordMatch){
                throw new Error("WRONG_CREDENTIALS");
            }
            const token = AuthUtils.generateAuthToken({email : user.email , userName : user.userName});
            user = user.toObject();
            user.token = token;
            delete user.password;
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
        updatedUser = updatedUser.toObject();
        delete updatedUser.password;
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

const removeFavouriteImage = async(payload, user) => {
    let criteria = {
        email: user.email
    };
    let updateObject = {
        "$pull" : {
            "favouriteImages" : payload.query.imageId
        }
    };
    let options = {
        new: true
    };
    try {
        let updatedUser = await dbService.updateUser(criteria, updateObject, options);
        return updatedUser;
    } catch(e){ 
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
    getOwnAccountInfo,
    removeFavouriteImage
}


