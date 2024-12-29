import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  birth: {
    type: Date,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  phone: {
    type: String,
    unique: true,
    required: true,
  },
  account: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  blocked: {
    type: Boolean,
    default: false,
  },
  deleted: {
    type: Boolean,
    default: false,
  },
  verificationCode: String,
  vFCodeExpirationTime: Date,
  isConfirmed: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const saltRounds = 10;
  this.password = await bcrypt.hash(this.password, saltRounds);
  next();
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const userModel = mongoose.model("users", userSchema);
export default userModel;