import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    birthDate: {
      type: Date,
      required: true,
    },
    email: {
      type: String,
    },
    phone: {
      type: String,
      required: true,
    },
    account: {
      type: String,
    },
    password: {
      type: String,
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

    ////////EMPLOYEE/////////////
    jobTitle: {
      type: String,
    },
    salary: {
      type: Number,
    },
    shiftStart: {
      type: {
        hour: Number,
        minute: Number,
      },
    },
    shiftEnd: {
      type: {
        hour: Number,
        minute: Number,
      },
    },

    role: {
      type: String,
      enum: ["user", "employee"],
    },
  },
  {
    timestamps: true,
  }
);

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
