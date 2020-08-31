const db = require('./db.service');

const saveImage = async (payload, user) => {
    let imageToSave = {
        platform: payload.platform, 
        imageId: payload.imageId,
        pageUrl: payload.pageUrl,
        smallImageUrl: payload.smallImageUrl,
        mediumImageUrl: payload.mediumImageUrl,
        largeImageUrl: payload.largeImageUrl,
        downloadUrl: payload.downloadUrl
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