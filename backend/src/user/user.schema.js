import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
  userName: String,
  userBirth: Date,
  userEmail: {
    type: String,
    unique: true
  },
  userPhone: {
    type: String,
    unique: true
  },
  userPass: String,
  userActive: {
    type: Boolean,
    default: true
  },
  userVerificationCode: String,
  userVFCodeExpirationTime: Date,
  userIsConfirmed: {
    type: Boolean,
    default: false
  },
}, {
  timestamps: true,
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("userPass")) return next();
  const saltRounds = 10;
  this.userPass = await bcrypt.hash(this.userPass, saltRounds);
  next();
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.userPass);
};

const userModel = mongoose.model("users", userSchema);
export default userModel;