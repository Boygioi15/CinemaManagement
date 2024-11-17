import { UserService } from "./user.service.js";
import expressAsyncHandler from "express-async-handler";
import userModel from "./user.schema.js";

class UserController {
  createUser = expressAsyncHandler(async (req, res, next) => {
    const createdUser = await UserService.createUser(req.body);
    if (createdUser?.error) {
      return res.status(400).json({
        msg: createdUser.error,
        success: false,
      });
    }
    return res.status(200).json({
      msg: "User created successfully!",
      success: true,
      user: createdUser,
    });
  });

  updateUser = expressAsyncHandler(async (req, res, next) => {
    const { userId } = req.params;
    const updatedUser = await UserService.updateUserById(userId, req.body);
    if (updatedUser?.error) {
      return res.status(400).json({
        msg: updatedUser.error,
        success: false,
      });
    }
    if (!updatedUser) {
      return res.status(404).json({
        msg: "User not found!",
        success: false,
      });
    }
    return res.status(200).json({
      msg: "User updated successfully!",
      success: true,
      user: updatedUser,
    });
  });

  deleteUser = expressAsyncHandler(async (req, res, next) => {
    const { userId } = req.params;
    const deletedUser = await UserService.deleteUserById(userId);
    if (!deletedUser) {
      return res.status(404).json({
        msg: "User not found!",
        success: false,
      });
    }
    res.status(200).json({
      msg: "User deleted successfully!",
      success: true,
      user: deletedUser,
    });
  });

  getAllUsers = expressAsyncHandler(async (req, res, next) => {
    const users = await UserService.getAllUsers();
    res.status(200).json({
      msg: users,
      success: true,
    });
  });

  /*
    //send phone code
    requestOTP = expressAsyncHandler(async (req, res, next) => {
      const { userPhone } = req.body;
      const user = await UserService.findUserByPhone(userPhone);
      if (!user) {
        return res.status(404).json({ msg: "User not found", success: false });
      }
  
      const otp = Math.floor(100000 + Math.random() * 900000);
      const sent = await UserService.sendOTP(userPhone, otp);
  
      if (sent) {
        await UserService.storeOTP(userPhone, otp);
        return res
          .status(200)
          .json({ msg: "OTP sent successfully", success: true });
      } else {
        return res
          .status(500)
          .json({ msg: "Failed to send OTP", success: false });
      }
    });
    */

  //Login by email or phone with password
  loginUser = expressAsyncHandler(async (req, res, next) => {
    const { identifier, userPass, userOTP } = req.body;
    const user = await UserService.checkExitAndActiveUser(identifier);
    if (!user) {
      return res.status(404).json({ msg: user, success: false });
    }

    if (userPass) {
      const isMatch = await user.comparePassword(userPass);
      if (!isMatch) {
        return res.status(404).json({ msg: "Incorrect password!", success: false });
      }
      return res.status(200).json({ msg: "Login successful!", success: true, user });
    }


    if (userOTP) {
      const sendOtp = await UserService.sendOtp
      const isValidOTP = await UserService.verifyOTP(user.userPhone, userOTP);
      if (!isValidOTP) {
        return res.status(404).json({ msg: "Invalid OTP!", success: false });
      }
      return res.status(200).json({ msg: "Login successful with OTP!", success: true, user });
    }

    return res.status(400).json({ msg: "Bad request: Provide password or OTP!", success: false });
  });

  sendConfirmCode = expressAsyncHandler(async (req, res, next) => {
    const { identifier } = req.body;

    const user = (await UserService.findUserByEmail(identifier)) || (await UserService.findUserByPhone(identifier));
    if (!user) {
      return res.status(404).json({ msg: "User not found", success: false });
    }

    const isEmail = identifier.includes("@");
    if (!isEmail) {
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      await UserService.sendOTP(identifier, otp);
      await UserService.storeOTP(user.userId, otp);
      return res.status(200).json({ msg: "OTP sent successfully!", success: true });
    }
    else {
      const randomVerificationCode = () => {
        const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        let code = "";
        for (let i = 0; i < 6; i++) {
          const randomIndex = Math.floor(Math.random() * characters.length);
          code += characters[randomIndex];
        }
        return code;
      };
      const verificationCode = randomVerificationCode();
      await UserService.sendEmail(identifier, "Verification Code", `Your verification code is: ${verificationCode}`);
      await UserService.storeVerificationCode(identifier, verificationCode);
      return res.status(200).json({ msg: "Verification code sent successfully!", success: true });
    }
  });

  checkConfirmCode = expressAsyncHandler(async (req, res, next) => {
    const { identifier, confirmcode } = req.body;

    const user = (await UserService.findUserByEmail(identifier)) || (await UserService.findUserByPhone(identifier));
    if (!user) {
      return res.status(404).json({ msg: "User not found!", success: false });
    }

    const isEmail = identifier.includes("@");
    if (!isEmail) {
      if (user.userOTP !== confirmcode) {
        return res.status(404).json({ msg: "Invalid OTP code!", success: false });
      }
    } else {
      if (user.userVerificationCode !== confirmcode) {
        return res.status(404).json({ msg: "Invalid verification code!", success: false });
      }
    }

    user.userIsConfirmed = true;
    await user.save();

    return res.status(200).json({ msg: "Confirmed successfully!", success: true });
  });

  resetPassword = expressAsyncHandler(async (req, res, next) => {
    const { identifier, newPassword } = req.body;

    const user = (await UserService.findUserByEmail(identifier)) || (await UserService.findUserByPhone(identifier));
    if (!user) {
      return res.status(404).json({ msg: "User not found!", success: false });
    }

    user.userPass = newPassword;
    user.userIsConfirmed = false;
    user.userVerificationCode = undefined;
    user.userOTP = undefined;
    user.userOTPExpirationTime = new Date(0);
    user.userVFCodeExpirationTime = new Date(0);
    await user.save();

    return res.status(200).json({ msg: "Password reset successfully!", success: true });
  });
}

export default new UserController();
