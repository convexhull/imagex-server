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
    select: false,
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
  passwordChangedAt: Date,
  role: {
    type: String,
    enum: ["MEMBER", "ADMIN"],
    default: "MEMBER",
  },
});

UserSchema.pre("save", async function () {
  if (this.isModified("password")) {
    this.password = await Hashing.encryptPassword(this.password);
    this.passwordConfirm = undefined;
  }
});

UserSchema.methods.hasChangedPasswordAfter = function (jwtTimestamp) {
  if (this.passwordChangedAt) {
    console.log(this.passwordChangedAt.getTime(), jwtTimestamp);
    return jwtTimestamp < this.passwordChangedAt.getTime() / 1000;
  }
  return false;
};

UserSchema.methods.checkCorrectPassword = async function (candidatePassword) {
  const isPasswordMatching = await Hashing.decryptPassword(
    candidatePassword,
    this.password
  );
  return isPasswordMatching;
};

module.exports = mongoose.model("User", UserSchema);
