const axios = require('axios');




const getSimilarImages = async (req, res) => {
    const base64Image = req.file.buffer.toString('base64');
    let imageUploadURL = `https://api.shutterstock.com/v2/cv/images`;
    let imageUploadData = {
        "base64_image": base64Image
    };
    let imageUploadConfig = {
        headers: {
            'Authorization': "Bearer v2/QUlPVjJWVUpHd0FRckxVWTQxczFrUjBTY2JxS3pvdjcvMjY3OTYxMTE4L2N1c3RvbWVyLzMvY3JsMWxmR3p2Z1pydXFLR2hXcnFkeVpLRUthWEdMWXRwNkVQVWZRejIzQ29PXzVhSTBsVk14RGxoRWU3QUtEZGUwZVhJejdiTlZQQVJ5aHc4RHZPWXl3LUFxN1YzTU12MjFlMXUwWWZ1VjFSMERZVzZqU3l0RUptRFlCUktTNm41QU55dkRyZ3RkSzVBWUVZVEVZN055TGVCd2dGZEttLVpmd1lFR2tqSzFrdE92dTV5YWhBR094U2czX011N3VoRy1uMHIxbklDVDZlZ2NsOFExLXFZZw"
        }
    }
    let imageUploadResponse = await axios.post(imageUploadURL, imageUploadData, imageUploadConfig);
    console.log(imageUploadResponse.data);
    res.send(imageUploadResponse.data);
    // axios.post(imageUploadURL, , {
        
    // })
    //     .then(data => {
    //         console.log(data.data);
    //         return axios.get(`https://api.shutterstock.com/v2/cv/similar/images?asset_id=${data.data.upload_id}`, {
    //             headers: {
    //                 'Authorization': "Bearer v2/QUlPVjJWVUpHd0FRckxVWTQxczFrUjBTY2JxS3pvdjcvMjY3OTYxMTE4L2N1c3RvbWVyLzMvY3JsMWxmR3p2Z1pydXFLR2hXcnFkeVpLRUthWEdMWXRwNkVQVWZRejIzQ29PXzVhSTBsVk14RGxoRWU3QUtEZGUwZVhJejdiTlZQQVJ5aHc4RHZPWXl3LUFxN1YzTU12MjFlMXUwWWZ1VjFSMERZVzZqU3l0RUptRFlCUktTNm41QU55dkRyZ3RkSzVBWUVZVEVZN055TGVCd2dGZEttLVpmd1lFR2tqSzFrdE92dTV5YWhBR094U2czX011N3VoRy1uMHIxbklDVDZlZ2NsOFExLXFZZw"
    //             }
    //         })
    //     })
    //     .then(d => {
    //         console.log(d.data);
    //         res.send(d.data);
    //     })
    //     .catch(e => {
    //         console.log(e.message);
    //     })
}   





module.exports = {
    getSimilarImages
}