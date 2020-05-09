// Load the AWS SDK for Node.js
const AWS = require('aws-sdk');
// Set the region 
AWS.config.update({region: 'us-east-2'});

// Create S3 service object
s3 = new AWS.S3({apiVersion: '2006-03-01'});

// call S3 to retrieve upload file to specified bucket
// const uploadParams = {Bucket: process.env.AWS_IMAGE_BUCKET, Key: '', Body: ''};


// call S3 to retrieve upload file to specified bucket
// s3.upload (uploadParams, function (err, data) {
//   if (err) {
//     console.log("Error", err);
//   } if (data) {
//     console.log("Upload Success", data.Location);
//   }
// });


module.exports = s3;
