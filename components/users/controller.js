const userService = require('./services');



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
        res.send({
            ...apiResponse,
            success : false,
            error : true,
            message : e.message
        });
    }
}


module.exports = {
    createNewUser,
    loginUser
}