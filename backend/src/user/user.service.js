import userModel from "./user.schema.js";

export class UserService {
  static findUserByEmail = async (email) => {
    return await userModel.findOne({ email, blocked: false });
  };

  static findUserByPhone = async (phone) => {
    return await userModel.findOne({ phone, blocked: false });
  };

  static checkExitAndBlockedUser = async (identifier) => {
    const user =
      (await UserService.findUserByEmail(identifier)) ||
      (await UserService.findUserByPhone(identifier));

    if (!user) {
      return { error: "User not found!" };
    }

    if (user.blocked) {
      return { error: "User is blocked!" };
    }

    return user;
  };

  static createUser = async (userdata) => {
    const { email, phone } = userdata;

    if (!email || !phone) {
      return { error: "Email and phone are required!" };
    }

    const existingUserPhone = await this.findUserByPhone(phone);
    if (existingUserPhone) {
      return { error: "Phone number already registered!" };
    }

    const existingUserEmail = await this.findUserByEmail(email);
    if (existingUserEmail) {
      return { error: "Email already registered!" };
    }

    return await userModel.create(userdata);
  };

  static updateUserById = async (_id, updatedata) => {
    try {
      const { email, phone } = updatedata;

      const conflicts = await userModel.findOne({
        $or: [{ phone: phone }, { email: email }],
        _id: { $ne: _id },
      });

      if (conflicts) {
        return { error: "Phone number or email already registered!" };
      }

      const updatedUser = await userModel.findOneAndUpdate(
        { _id },
        updatedata,
        { new: true }
      );

      if (!updatedUser) {
        return { error: "User not found!" };
      }

      return updatedUser;
    } catch (error) {
      console.error("Error updating user:", error);
      throw new Error("An error occurred while updating user.");
    }
  };

  static deleteUserById = async (_id) => {
    return await userModel.findOneAndUpdate(
      { _id },
      { deleted: true },
      { new: true }
    );
  };

  static getAllUsers = async () => {
    return await userModel.find({ deleted: false });
  };

  static getUserById = async (_id) => {
    try {
      const user = await userModel.findOne({ _id, deleted: false });
      if (!user) {
        return { error: "User not found or has been deleted!" };
      }
      return user;
    } catch (error) {
      console.error("Error fetching user by ID:", error);
      throw new Error("An error occurred while fetching the user.");
    }
  };
}