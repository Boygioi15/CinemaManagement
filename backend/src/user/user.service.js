import userModel from "./user.schema.js";
import transporter from "./user.serverEmailConnect.js";
import sendOTPMessage from "./user.serverSMSConnect.js";

export class UserService {
  static findUserById = async (userid) => {
    return await userModel.findById(userid);
  };

  static findUserByEmail = async (useremail) => {
    return await userModel.findOne({ useremail });
  };

  static findUserByPhone = async (userphone) => {
    return await userModel.findOne({ userphone });
  };

  static checkExitAndActiveUser = async (identifier) => {
    const user = (await UserService.findUserByEmail(identifier)) || (await UserService.findUserByPhone(identifier));
    if (!user) {
      return { error: "User not found!" };
    }
    if (!user.userActive) {
      return { error: "User has been blocked! Please contact administrator to resolve!" };
    }
  };

  static createUser = async (userdata) => {
    const { userEmail, userPhone } = userdata;
    const existingUserPhone = await this.findUserByPhone(userPhone);
    if (existingUserPhone) {
      return { error: "Phone number already registered!" };
    }
    const existingUserEmail = await this.findUserByEmail(userEmail);
    if (existingUserEmail) {
      return { error: "Email already registered!" };
    }
    return await userModel.create(userdata);
  };

  static updateUserById = async (userid, updatedata) => {
    try {
      const { userEmail, userPhone } = updatedata;
      const conflicts = await userModel.findOne({
        $or: [{ userPhone }, { userEmail }],
        userId: { $ne: userid },
      });
      if (conflicts) {
        return { error: "Phone number or email already registered!" };
      }
      return await userModel.findOneAndUpdate(userid, updatedata, {
        new: true,
      });
    } catch (error) {
      console.error("Error updating user:", error);
      throw error;
    }
  };

  static deleteUserById = async (userid) => {
    return await userModel.findOneAndDelete({ userid });
  };

  static getAllUsers = async () => {
    return await userModel.find({});
  };

  static sendEmail = async (to, subject, text) => {
    try {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: to,
        subject: subject,
        text: text,
      });
      console.log("Email sent successfully!");
      return true;
    } catch (error) {
      console.error("Error sending email:", error.message);
      return false;
    }
  };

  static sendOTP = async (userPhone, otp) => {
    try {
      const result = await sendOTPMessage(userPhone, otp);
      console.log("OTP sent successfully!");
      return result;
    } catch (error) {
      console.error("Error in sending OTP from service:", error);
      return false;
    }
  };

  static checkOTP = async (userPhone, otp) => {
    const user = await this.findUserByPhone(userPhone);
    if (!user) return false;
    if (user.userOTP === otp && user.userOTPExpirationTime > new Date()) {
      await userModel.updateOne({ userPhone }, { $unset: { otp: "", otpExpiration: "" } });
      return true;
    }
    return false;
  };

  static storeConfirmCode = async (identifier, confirmcode) => {
    const expirationTime = new Date(Date.now() + 3 * 60 * 1000); // 3 phút từ thời điểm gửi mã
    const isEmail = identifier.includes("@");
    if (!isEmail) {
      return await userModel.findOneAndUpdate(
        { identifier },
        {
          userOTP: confirmcode,
          userOTPExpirationTime: expirationTime
        },
        { new: true }
      );
    }
    else {
      return await userModel.findOneAndUpdate(
        { identifier },
        {
          userVerificationCode: confirmcode,
          userVFCodeExpirationTime: expirationTime
        },
        { new: true }
      );
    }
  };
}
