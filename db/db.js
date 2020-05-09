const mongoose = require('mongoose');

const dbURL = process.env.MONGODB_URI || "mongodb://localhost:27017/image-x";

(() =>{ 

    mongoose.connect(dbURL, {useNewUrlParser : true , useUnifiedTopology : true});

    mongoose.connection.on('connected', function(){
        console.log("Mongoose default connection is open to ", dbURL);
    });

    mongoose.connection.on('error', function(err){
        console.log("Mongoose default connection has occured "+err+" error");
    });

    mongoose.connection.on('disconnected', function(){
        console.log("Mongoose default connection is disconnected");
    });

    process.on('SIGINT', function(){
        mongoose.connection.close(function(){
            console.log("Mongoose default connection is disconnected due to application termination");
            process.exit(0)
        });
    });
})();
