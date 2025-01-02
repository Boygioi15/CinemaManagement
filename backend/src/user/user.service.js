import {
  User_AuthService,
  Employee_AuthService,
} from "../auth/auth.service.js";
import { customError } from "../middlewares/errorHandlers.js";
import userModel from "./user.schema.js";
import bcrypt from "bcrypt";
export class UserService {
  static findUserByEmail = async (email) => {
    return await userModel.findOne({
      email: email,
      blocked: false,
      role: "user",
    });
  };

  static findUserByPhone = async (phone) => {
    return await userModel.findOne({
      phone: phone,
      blocked: false,
      role: "user",
    });
  };

  static async findUserByIdentifier(identifier) {
    console.log(identifier);
    return await userModel
      .findOne({
        $and: [
          {
            blocked: false,
            role: "user",
          },
          {
            $or: [
              {
                email: identifier,
              },
              {
                phone: identifier,
              },
              {
                account: identifier,
              },
            ],
          },
        ],
      })
      .lean();
  }

  static checkExitAndBlockedUser = async (identifier) => {
    const user = await this.findUserByIdentifier(identifier);
    return user;
  };

  static createUser = async (userdata) => {
    const {
      name,
      birthDate,
      email,
      phone,
      account,
      password,
      confirmPassword,
    } = userdata;

    if (password != confirmPassword) {
      throw customError("Mật khẩu và xác nhận mật khẩu không khớp");
    }
    if (password.leghth < 7) {
      throw customError("Mật khẩu phải có ít nhất 7 kí tự");
    }
    if (!name || !birthDate || !email || !phone || !account || !password) {
      return {
        error: "Chưa điền đẩy đủ các trường!",
      };
    }

    const existingUserPhone = await this.findUserByPhone(phone);
    if (existingUserPhone) {
      return {
        error: "Số điện thoại đã được đăng ký!",
      };
    }

    const existingUserEmail = await this.findUserByEmail(email);
    if (existingUserEmail) {
      return {
        error: "Email đã được đăng ký!",
      };
    }
    if (await userModel.findOne({ account: account, role: "user" })) {
      throw customError("Tài khoản đã được đăng ký!");
    }

    userdata.role = "user";
    return await userModel.create(userdata);
  };

  static updateUserById = async (_id, updatedata) => {
    try {
      const { email, phone } = updatedata;

      const conflicts = await userModel.findOne({
        $or: [
          {
            phone: phone,
          },
          {
            email: email,
          },
        ],
        _id: {
          $ne: _id,
        },
        role: "user",
      });

      if (conflicts) {
        return {
          error: "Số điện thoại hoặc email đã tồn tại!",
        };
      }

      const updatedUser = await userModel.findOneAndUpdate(
        {
          _id,
          role: "user",
        },
        updatedata,
        {
          new: true,
        }
      );

      if (!updatedUser) {
        return {
          error: "Không tìm thấy user!",
        };
      }

      return updatedUser;
    } catch (error) {
      console.error("Error updating user:", error);
      throw new Error("Lỗi bất ngờ!");
    }
  };

  static deleteUserById = async (_id) => {
    return await userModel.findOneAndUpdate(
      {
        _id,
        role: "user",
      },
      {
        deleted: true,
      },
      {
        new: true,
      }
    );
  };

  static getAllUsers = async () => {
    return await userModel.find({
      deleted: false,
      role: "user",
    });
  };

  static getUserById = async (_id) => {
    try {
      const user = await userModel.findOne({
        _id,
        role: "user",
        deleted: false,
      });
      if (!user) {
        return {
          error: "User not found or has been deleted!",
        };
      }
      return user;
    } catch (error) {
      console.error("Error fetching user by ID:", error);
      throw new Error("An error occurred while fetching the user.");
    }
  };

  static changePassword = async (
    id,
    { oldPassword, newPassword, confirmNewPassword }
  ) => {
    const user = await userModel
      .findOne({
        _id: id,
        role: "user",
      })
      .lean();
    if (!user) throw customError("Không tìm thấy người dùng");

    const checkPassword = await User_AuthService.checkPassword(
      oldPassword,
      user.password
    );
    if (!checkPassword) throw customError("Mật khẩu không đúng");

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    // Cập nhật mật khẩu mới
    const update = await userModel.findOneAndUpdate(
      {
        _id: id,
      },
      {
        password: hashedPassword,
      },
      {
        new: true,
      } // Trả về tài liệu mới sau khi cập nhật
    );
    return update;
  };

  static blockUser = async (_id) => {
    return await userModel.findByIdAndUpdate(
      _id,
      { blocked: true },
      { new: true }
    );
  };
  static unblockUser = async (_id) => {
    return await userModel.findByIdAndUpdate(
      _id,
      { blocked: false },
      { new: true }
    );
  };
}

export class EmployeeService {
  static findEmployeeByEmail = async (email) => {
    return await userModel.findOne({
      email,
      blocked: false,
      role: "employee",
    });
  };

  static findEmployeeByPhone = async (phone) => {
    return await userModel.findOne({
      phone,
      blocked: false,
      role: "employee",
    });
  };

  static async findEmployeeByIdentifier(identifier) {
    return await userModel
      .findOne({
        $and: [
          {
            blocked: false,
            role: "employee",
          },
          {
            $or: [
              {
                email: identifier,
              },
              {
                phone: identifier,
              },
              {
                account: identifier,
              },
            ],
          },
        ],
      })
      .lean();
  }

  static checkExitAndBlockedEmployee = async (identifier) => {
    const user = await this.findEmployeeByIdentifier(identifier);
    return user;
  };

  static createEmployee = async (userdata) => {
    const {
      jobTitle,
      salary,
      shiftStart,
      shiftEnd,
      name,
      birthDate,
      email,
      phone,
    } = userdata;

    if (
      !jobTitle ||
      !salary ||
      !shiftEnd ||
      !shiftStart ||
      !name ||
      !birthDate
    ) {
      throw customError("Chưa điền đầy đủ các trường. Vui lòng nhập lại!");
    }
    const existingEmployeePhone = await this.findEmployeeByPhone(phone);
    if (existingEmployeePhone) {
      return {
        error: "Số điện thoại đã được đăng ký!",
      };
    }

    const existingEmployeeEmail = await this.findEmployeeByEmail(email);
    if (existingEmployeeEmail) {
      return {
        error: "Email đã được đăng ký!",
      };
    }
    userdata.role = "employee";
    return await userModel.create(userdata);
  };

  static updateEmployeeById = async (id, updatedata) => {
    try {
      const { email, phone } = updatedata;

      const conflicts = await userModel.findOne({
        role: "employee",
        $or: [{ phone: phone }, { email: email }],
        _id: { $ne: id },
      });

      if (conflicts) {
        return {
          error: "Số điện thoại hay email đã được đăng ký!",
        };
      }
      const updatedEmployee = await userModel.findOneAndUpdate(
        {
          _id: id,
          role: "employee",
        },
        updatedata,
        {
          new: true,
        }
      );

      if (!updatedEmployee) {
        return {
          error: "Không tìm thấy nhân viên!",
        };
      }

      return updatedEmployee;
    } catch (error) {
      console.error("Error updating user:", error);
      throw new Error("Lỗi bất ngờ!");
    }
  };

  static deleteEmployeeById = async (id) => {
    return await userModel.findOneAndUpdate(
      {
        _id: id,
        role: "employee",
      },
      {
        deleted: true,
      },
      {
        new: true,
      }
    );
  };

  static getAllEmployees = async () => {
    return await userModel.find({
      deleted: false,
      role: "employee",
    });
  };

  static getEmployeeById = async (_id) => {
    try {
      const user = await userModel.findOne({
        _id,
        deleted: false,
        role: "employee",
      });
      if (!user) {
        return {
          error: "Employee not found or has been deleted!",
        };
      }
      return user;
    } catch (error) {
      console.error("Error fetching user by ID:", error);
      throw new Error("An error occurred while fetching the user.");
    }
  };

  static updateEmployeeAccount = async (id, accountInfo) => {
    const { account, password, confirmPassword } = accountInfo;
    if (!account || !password || !confirmPassword) {
      throw customError("Vui lòng nhập đầy đủ các trường");
    }
    if (password !== confirmPassword) {
      throw customError("Mật khẩu và xác nhận mật khẩu không khớp");
    }
    const employee = userModel.findOne({
      _id: id,
      role: "employee",
    });
    if (!employee) {
      throw customError("Không tìm thấy nhân viên!");
    }
    const accountExist = userModel.findOne({
      account: account,
      role: "employee",
    });
    if (accountExist) {
      throw customError("Tài khoản đã tồn tại!");
    }
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return await userModel.findByIdAndUpdate(_id, {
      account: account,
      password: hashedPassword,
    });
  };
  static getAllEmployeeAccount = async () => {
    return await userModel.find({
      role: "employee",
      $or: [
        { account: { $exists: false } }, // Field does not exist
        { account: null }, // Field exists but is null
      ],
    });
  };
}
