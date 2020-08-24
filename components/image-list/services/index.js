const db = require('./db.service');

const saveImage = async (payload, user) => {
    let imageToSave = {
        url: payload.url,
        platform: payload.platform, 
        imageId: payload.imageId
    };
    try {
        let savedImage = await db.insertImage(imageToSave);
        return savedImage        
    } catch(e) {    
        throw e;
    }
}


module.exports = {
    saveImage
}