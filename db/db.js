const mongoose = require("mongoose");

const dbURL = process.env.MONGODB_URI || "mongodb://localhost:27017/image-x";

(async () => {
  try {
    await mongoose.connect(dbURL);
    console.log("Connection to MongoDB server successful");
  } catch (err) {
    console.error("Connection to MongoDB server failed");
    console.log(err);
  }
})();
