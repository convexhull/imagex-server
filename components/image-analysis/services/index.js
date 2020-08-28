const awsS3 = require('.././../../utils/aws');


const uploadImageToS3 = async (payload, data) => {

    let s3UploadParams = {
        Bucket: process.env.AWS_IMAGE_BUCKET,
        Body: payload.file.buffer,
        Key: "image2.jpeg",
    };

    return new Promise( (resolve, reject) => {
        awsS3.upload(s3UploadParams, function(err, data){
            if(err){
                reject(err);
            }
            if(data){
                resolve({ imageLocation : data.Location});
            }
        });
    })
    
}




module.exports = {
    uploadImageToS3
}