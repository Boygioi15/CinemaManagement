import userModel from "./user.schema.js";

export class UserService {
  static findUserByEmail = async (userEmail) => {
    return await userModel.findOne({
      userEmail,
      userActive: true
    });
  };

  static findUserByPhone = async (userPhone) => {
    return await userModel.findOne({
      userPhone,
      userActive: true
    });
  };

  static checkExitAndActiveUser = async (identifier) => {
    const user = (await UserService.findUserByEmail(identifier)) || (await UserService.findUserByPhone(identifier));
    return user
  };

  static createUser = async (userdata) => {
    const {
      userEmail,
      userPhone
    } = userdata;
    const existingUserPhone = await this.findUserByPhone(userPhone);
    if (existingUserPhone) {
      return {
        error: "Phone number already registered!"
      };
    }
    const existingUserEmail = await this.findUserByEmail(userEmail);
    if (existingUserEmail) {
      return {
        error: "Email already registered!"
      };
    }
    return await userModel.create(userdata);
  };

  static updateUserById = async (userid, updatedata) => {
    try {
      const {
        userEmail,
        userPhone
      } = updatedata;
      const conflicts = await userModel.findOne({
        $or: [{
          userPhone
        }, {
          userEmail
        }],
        userId: {
          $ne: userid
        },
      });
      if (conflicts) {
        return {
          error: "Phone number or email already registered!"
        };
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
    return await userModel.findOneAndDelete({
      userid
    });
  };

  static getAllUsers = async () => {
    return await userModel.find({});
  };



}