import { UserService } from "./user.service.js";
import expressAsyncHandler from "express-async-handler";
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
      msg: "User created successfully",
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
        msg: "User not found",
        success: false,
      });
    }

    return res.status(200).json({
      msg: "User updated successfully",
      success: true,
      user: updatedUser,
    });
  });

  deleteUser = expressAsyncHandler(async (req, res, next) => {
    const { userId } = req.params;
    const deletedUser = await UserService.deleteUserById(userId);
    if (!deletedUser) {
      return res.status(404).json({
        msg: "User not found",
        success: false,
      });
    }
    res.status(200).json({
      msg: "User deleted successfully",
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
  //2 in one
  loginUser = expressAsyncHandler(async (req, res, next) => {
    const { identifier, password, otp } = req.body;
    const user =
      (await UserService.findUserByEmail(identifier)) ||
      (await UserService.findUserByPhone(identifier));
    if (!user) {
      return res.status(404).json({ msg: "User not found", success: false });
    }

    if (password) {
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res
          .status(401)
          .json({ msg: "Incorrect password!", success: false });
      }
      return res
        .status(200)
        .json({ msg: "Login successful", success: true, user });
    }

    if (otp) {
      const isValidOTP = await UserService.verifyOTP(user.userPhone, otp);
      if (!isValidOTP) {
        return res.status(401).json({ msg: "Invalid OTP", success: false });
      }
      return res
        .status(200)
        .json({ msg: "Login successful with OTP", success: true, user });
    }

    return res
      .status(400)
      .json({ msg: "Bad request: Provide password or OTP", success: false });
  });

  requestPasswordReset = expressAsyncHandler(async (req, res, next) => {
    const { identifier } = req.body;

    const isEmail = identifier.includes("@");
    if (!isEmail) {
      return res.status(501).json({
        msg: "Tính năng gửi OTP qua SMS đang phát triển",
        success: false,
      });
    }

    const user =
      (await UserService.findUserByEmail(identifier)) ||
      (await UserService.findUserByPhone(identifier));
    if (!user) {
      return res.status(404).json({ msg: "User not found", success: false });
    }

    const generateVerificationCode = () => {
      const characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      let code = "";
      for (let i = 0; i < 6; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        code += characters[randomIndex];
      }
      return code;
    };

    const verificationCode = generateVerificationCode();

    await UserService.sendVerificationCode(identifier, verificationCode);
    await UserService.storeVerificationCode(user._id, verificationCode);

    return res
      .status(200)
      .json({ msg: "Verification code sent successfully", success: true });
  });

  verifyCode = expressAsyncHandler(async (req, res, next) => {
    const { identifier, verificationCode } = req.body;

    const user =
      (await UserService.findUserByEmail(identifier)) ||
      (await UserService.findUserByPhone(identifier));
    if (!user) {
      return res.status(404).json({ msg: "User not found", success: false });
    }

    if (user.verificationCode !== verificationCode) {
      return res
        .status(401)
        .json({ msg: "Invalid verification code", success: false });
    }

    user.isVerified = true;
    await user.save();

    return res
      .status(200)
      .json({ msg: "Verification successful", success: true });
  });

  resetPassword = expressAsyncHandler(async (req, res, next) => {
    const { identifier, newPassword } = req.body;

    const user =
      (await UserService.findUserByEmail(identifier)) ||
      (await UserService.findUserByPhone(identifier));
    if (!user) {
      return res.status(404).json({ msg: "User not found", success: false });
    }

    if (!user.isVerified) {
      return res.status(401).json({ msg: "User not verified", success: false });
    }
    user.userPass = newPassword;
    user.isVerified = false;
    user.verificationCode = undefined;
    await user.save();

    return res
      .status(200)
      .json({ msg: "Password reset successfully", success: true });
  });
}

export default new UserController();
