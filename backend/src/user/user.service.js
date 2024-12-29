import {
  AuthService
} from "../auth/auth.service.js";
import {
  customError
} from "../middlewares/errorHandlers.js";
import userModel from "./user.schema.js";
import bcrypt from "bcrypt";
export class UserService {
  static findUserByEmail = async (email) => {
    return await userModel.findOne({
      email,
      blocked: false
    });
  };

  static findUserByPhone = async (phone) => {
    return await userModel.findOne({
      phone,
      blocked: false
    });
  };

  static async findUserByIdentifier(identifier) {
    return await userModel.findOne({
      $and: [{
          blocked: false
        },
        {
          $or: [{
              email: identifier
            },
            {
              phone: identifier
            },
            {
              account: identifier
            }
          ]
        }
      ]
    }).lean();
  }

  static checkExitAndBlockedUser = async (identifier) => {
    const user = await this.findUserByIdentifier(identifier)
    return user;
  };

  static createUser = async (userdata) => {
    const {
      email,
      phone
    } = userdata;

    if (!email || !phone) {
      return {
        error: "Email and phone are required!"
      };
    }

    const existingUserPhone = await this.findUserByPhone(phone);
    if (existingUserPhone) {
      return {
        error: "Phone number already registered!"
      };
    }

    const existingUserEmail = await this.findUserByEmail(email);
    if (existingUserEmail) {
      return {
        error: "Email already registered!"
      };
    }

    return await userModel.create(userdata);
  };

  static updateUserById = async (_id, updatedata) => {
    try {
      const {
        email,
        phone,
      } = updatedata;

      const conflicts = await userModel.findOne({
        $or: [{
          phone: phone
        }, {
          email: email
        }],
        _id: {
          $ne: _id
        },
      });

      if (conflicts) {
        return {
          error: "Phone number or email already registered!"
        };
      }

      const updatedUser = await userModel.findOneAndUpdate({
          _id
        },
        updatedata, {
          new: true
        }
      );

      if (!updatedUser) {
        return {
          error: "User not found!"
        };
      }

      return updatedUser;
    } catch (error) {
      console.error("Error updating user:", error);
      throw new Error("An error occurred while updating user.");
    }
  };

  static deleteUserById = async (_id) => {
    return await userModel.findOneAndUpdate({
      _id
    }, {
      deleted: true
    }, {
      new: true
    });
  };

  static getAllUsers = async () => {
    return await userModel.find({
      deleted: false
    });
  };

  static getUserById = async (_id) => {
    try {
      const user = await userModel.findOne({
        _id,
        deleted: false
      });
      if (!user) {
        return {
          error: "User not found or has been deleted!"
        };
      }
      return user;
    } catch (error) {
      console.error("Error fetching user by ID:", error);
      throw new Error("An error occurred while fetching the user.");
    }
  };

  static changePassword = async (id, {
    oldPassword,
    newPassword,
    confirmNewPassword
  }) => {
    const user = await userModel.findById(id).lean();
    if (!user) throw customError("Không tìm thấy người dùng")

    const checkPassword = await AuthService.checkPassword(oldPassword, user.password)
    if (!checkPassword) throw customError("Mật khẩu không đúng")

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    // Cập nhật mật khẩu mới
    const update = await userModel.findOneAndUpdate({
        _id: id
      }, {
        password: hashedPassword
      }, {
        new: true
      } // Trả về tài liệu mới sau khi cập nhật
    );
    return update
  }
}