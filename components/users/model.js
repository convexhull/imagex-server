const mongoose = require("mongoose");
const Hashing = require("../../utils/hash");

const Schema = mongoose.Schema;

const UserSchema = Schema({
  userName: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: {
    type: String,
    required: true,
    minlength: [8, "Password should be atleast 8 characters long"],
  },
  passwordConfirm: {
    type: String,
    required: true,
    minlength: 8,
    validate: {
      validator: function (val) {
        return val === this.password;
      },
      message: "Password and password confirm don't match",
    },
  },
  firstName: { type: String, required: true },
  lastName: { type: String },
  profilePicUrl: { type: String },
  favouriteImages: [{ type: Schema.Types.ObjectId }],
  bio: { type: String },
});

UserSchema.pre("save", async function () {
  if (this.isModified("password")) {
    this.password = await Hashing.encryptPassword(this.password);
    this.passwordConfirm = undefined;
  }
});

module.exports = mongoose.model("User", UserSchema);
