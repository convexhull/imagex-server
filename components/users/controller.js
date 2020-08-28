const userService = require('./services');
const services = require('./services');
const { response } = require('express');



const createNewUser = async (req, res) => {

    let apiResponse = {
        success : true,
        error : false,
        message : ``,
        data : null
    };

    let payload = {...req};

    try {
        let createdUser = await userService.createNewUser(payload);
        res.send({
            ...apiResponse,
            message : "User was created successfully",
            data : { createdUser }
        })
    }
    catch(e){
        console.log(e);
        res.send({
            ...apiResponse,
            success : false,
            error : true,
            message : e.message
        })
    }
}



const loginUser = async (req, res) => {

    let apiResponse = {
        success : true,
        error : false,
        message : ``,
        data : null
    };

    let payload = { ...req };

    try {
        let user = await userService.loginUser(payload);
        res.send(user);
    }   
    catch(e){
        console.log(e);
        res.status(401).send({
            ...apiResponse,
            success : false,
            error : true,
            message : e.message
        });
    }
}


const getFavouriteImages = async (req, res) => {
    let responseData = {
        success: true,
        error: false,
        message: ``,
        data: null
    };
    try {
        let favouriteImages = await services.getFavouriteImages(req.user);
        responseData.data = favouriteImages;
        responseData.message = "Images fetched successfully";
        res.send(responseData);
    } catch(e) {
        responseData = {
            success: false,
            error: true,
            message: "Some error occurred",
        };
        res.status(500).send(responseData);
    }

}



const updateUser = async (req, res) => {
    let responseData = {
        success: false,
        error: false,
        message: '',
        data: null
    };
    try {
        let updateUser = await services.updateUserProfile(req);
        responseData = {
            success: true,
            error: false,
            message: "User updated successfully",
            data: updateUser
        }
        res.send(responseData);
    } catch(e) {
        console.log(e);
        responseData = {
            success: false,
            error: true,
            message: "Some error occurred in updating"
        }
        res.status(500).send(responseData);
    }   
}


const updateProfilePic = async (req, res) => {
  let responseData = {
    success: false,
    error: false,
    message: "",
    data: null,
  };
  try {
    let updatedUser = await services.updateProfilePic(req.file, req.user);
    responseData = {
      success: true,
      error: false,
      message: "Profile pic updated successfully",
      data: updatedUser,
    };
    res.send(responseData);
  } catch (e) {
    res.status(500).send(e.message);
  }
};

module.exports = {
    createNewUser,
    loginUser,
    getFavouriteImages,
    updateUser,
    updateProfilePic
}