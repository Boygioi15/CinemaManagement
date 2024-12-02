import {
  UserService
} from "./user.service.js";
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
      msg: "User created successfully!",
      success: true,
      user: createdUser,
    });
  });

  updateUser = expressAsyncHandler(async (req, res, next) => {
    const {
      userId
    } = req.params;
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
    const {
      userId
    } = req.params;
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

  sendConfirmCode = expressAsyncHandler(async (req, res, next) => {
    const {
      userEmail
    } = req.body;
    const user = (await UserService.findUserByEmail(userEmail));
    if (!user) {
      return res.status(404).json({
        msg: "User not found",
        success: false
      });
    }

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
    await UserService.storeConfirmCode(identifier, verificationCode);
    return res.status(200).json({
      msg: "Verification code sent successfully!",
      success: true
    });
  });

  checkConfirmCode = expressAsyncHandler(async (req, res, next) => {
    const {
      userEmail,
      userVerificationCode
    } = req.body;

    const user = (await UserService.findUserByEmail(userEmail));
    if (!user) {
      return res.status(404).json({
        msg: "User not found!",
        success: false
      });
    }

    if (user.userVerificationCode !== userVerificationCode || user.userVFCodeExpirationTime < new Date()) {
      return res.status(404).json({
        msg: "Invalid verification code!",
        success: false
      });
    }

    user.userIsConfirmed = true;
    await user.save();

    return res.status(200).json({
      msg: "Confirmed successfully!",
      success: true
    });
  });

  resetPassword = expressAsyncHandler(async (req, res, next) => {
    const {
      userEmail,
      newPassword
    } = req.body;

    const user = (await UserService.findUserByEmail(userEmail));
    if (!user) {
      return res.status(404).json({
        msg: "User not found!",
        success: false
      });
    }

    user.userPass = newPassword;
    user.userIsConfirmed = false;
    user.userVerificationCode = undefined;
    user.userVFCodeExpirationTime = new Date(0);

    await user.save();

    return res.status(200).json({
      msg: "Password reset successfully!",
      success: true
    });
  });
}

export default new UserController();