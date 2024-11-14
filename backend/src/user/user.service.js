import dotenv from "dotenv";
//import twilio from 'twilio';
import nodemailer from "nodemailer";
import userModel from "./user.schema.js";

dotenv.config();

/*
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

client.verify.v2.services("VA41cda5ad10c08380d139f3526d840c7d")
      .verifications
      .create({to: process.env.PHONE_NUMBER, channel: 'sms'})
      .then(verification => console.log(verification.sid));
*/

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export class UserService {
  static findUserById = async (userId) => {
    return await userModel.findById(userId);
  };

  static findUserByEmail = async (userEmail) => {
    return await userModel.findOne({ userEmail });
  };

  static findUserByPhone = async (userPhone) => {
    return await userModel.findOne({ userPhone });
  };

  static createUser = async (userData) => {
    const { userEmail, userPhone } = userData;

    const existingUserPhone = await this.findUserByPhone(userPhone);
    if (existingUserPhone) {
      return { error: "Phone number already registered" };
    }

    const existingUserEmail = await this.findUserByEmail(userEmail);
    if (existingUserEmail) {
      return { error: "Email already registered" };
    }

    return await userModel.create(userData);
  };

  static updateUserById = async (userId, updateData) => {
    try {
      const { userEmail, userPhone } = updateData;

      const conflicts = await userModel.findOne({
        $or: [{ userPhone }, { userEmail }],
        _id: { $ne: userId },
      });

      if (conflicts) {
        return { error: "Phone number or email already registered" };
      }

      return await userModel.findByIdAndUpdate(userId, updateData, {
        new: true,
      });
    } catch (error) {
      console.error("Error updating user:", error);
      throw error;
    }
  };

  static deleteUserById = async (userId) => {
    return await userModel.findByIdAndDelete(userId);
  };

  static getAllUsers = async () => {
    return await userModel.find({});
  };

  static storeOTPAndVerificationCode = async (userPhone, otp) => {
    const otpExpiration = new Date(Date.now() + 5 * 60000); // 5 minutes expiration
    return await userModel.findOneAndUpdate(
      { userPhone },
      { otp, otpExpiration },
      { verificationCode }
    );
  };

  static verifyOTP = async (userPhone, otp) => {
    const user = await this.findUserByPhone(userPhone);
    if (!user) return false;
    if (user.otp === otp && user.otpExpiration > new Date()) {
      await userModel.updateOne(
        { userPhone },
        { $unset: { otp: "", otpExpiration: "" } }
      );
      return true;
    }
    return false;
  };

  static sendEmail = async (to, subject, text) => {
    try {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: to,
        subject: subject,
        text: text,
      });
      return true;
    } catch (error) {
      console.error("Error sending email:", error);
      return false;
    }
  };

  static sendVerificationCode = async (contact, code) => {
    if (contact.includes("@")) {
      return await this.sendEmail(
        contact,
        "Verification Code",
        `Your verification code is: ${code}`
      );
    } else {
      //const otp = Math.floor(100000 + Math.random() * 900000).toString();
      //return await this.sendOTP(contact, otp);
      return "Tính năng đang phát triển";
    }
  };

  static storeVerificationCode = async (userId, code) => {
    return await userModel.findByIdAndUpdate(
      userId,
      { verificationCode: code },
      { new: true }
    );
  };
}
