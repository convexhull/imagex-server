const mongoose = require("mongoose");

const Schema = mongoose.Schema;

// const imageSchema = Schema({
//   platform: { type: String },
//   image: {
//     id: { type: String },
//     created_at: Date,
//     updated_at: Date,
//     promoted_at: Date,
//     width: Number,
//     height: Number,
//     color: String,
//     description: String,
//     alt_description: String,
//     urls: {
//       raw: String,
//       full: String,
//       regular: String,
//       small: String,
//       thumb: String,
//     },
//     links: {
//       self: String,
//       html: String,
//       download: String,
//       download_location: String,
//     },
//     user: {
//       username: String,
//       name: String,
//       first_name: String,
//       last_name: String,
//       profile_image: {
//         small: String,
//         medium: String,
//         large: String
//       }
//     }
//   },
// });

const UserSchema = Schema({
  userName: { type: String },
  email: { type: String },
  password: { type: String },
  firstName: { type: String },
  lastName: { type: String },
  profilePicUrl: { type: String },
  favouriteImages: [{ type: Schema.Types.ObjectId }],
  bio: { type: String }
//   favImages: [imageSchema]
});

module.exports = mongoose.model("User", UserSchema);
