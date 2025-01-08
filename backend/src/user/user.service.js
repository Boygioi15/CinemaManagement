import {
  User_AuthService,
  Employee_AuthService,
} from "../auth/auth.service.js";
import { customError } from "../middlewares/errorHandlers.js";
import PermissionImplement from "../permission/permission.implementation.js";
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
    userdata._id = null;

    if (
      !jobTitle ||
      !salary ||
      !shiftEnd ||
      !shiftStart ||
      !name ||
      !birthDate
    ) {
      throw customError("Chưa điền đầy đủ các trường. Vui lòng nhập lại!", 400);
    }

    // Kiểm tra tuổi trên 16
    const today = new Date();
    const birth = new Date(birthDate);
    const age = today.getFullYear() - birth.getFullYear();
    const isOver16 =
      age > 16 ||
      (age === 16 &&
        (today.getMonth() > birth.getMonth() ||
          (today.getMonth() === birth.getMonth() && today.getDate() >= birth.getDate())));
    if (!isOver16) {
      throw customError("Nhân viên phải trên 16 tuổi!", 400);
    }

    // Kiểm tra lương
    if (isNaN(salary) || salary <= 0) {
      throw customError("Lương nhân viên phải là một số nguyên không âm", 400);
    }

    // Kiểm tra thời gian ca làm việc
    const startTime = shiftStart.hour * 60 + shiftStart.minute;
    const endTime = shiftEnd.hour * 60 + shiftEnd.minute;
    if (startTime >= endTime) {
      throw customError("Thời gian bắt đầu làm phải trước khi thời gian kết thúc", 400);
    }

    // Kiểm tra định dạng email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw customError("Email không đúng định dạng", 400);
    }

    // Kiểm tra định dạng số điện thoại
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phone)) {
      throw customError("Số điện thoại không đúng định dạng", 400);
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
      const { email, phone, salary, shiftStart, shiftEnd, birthDate } = updatedata;
      
      // Kiểm tra tuổi trên 16 (nếu có cập nhật birthDate)
      if (birthDate) {
        const today = new Date();
        const birth = new Date(birthDate);
        const age = today.getFullYear() - birth.getFullYear();
        const isOver16 =
          age > 16 ||
          (age === 16 &&
            (today.getMonth() > birth.getMonth() ||
              (today.getMonth() === birth.getMonth() && today.getDate() >= birth.getDate())));
        if (!isOver16) {
          return {
            error: "Nhân viên phải trên 16 tuổi!",
          };
        }
      }

      // Kiểm tra lương
      if (salary !== undefined && (isNaN(salary) || salary <= 0)) {
        return {
          error: "Lương nhân viên phải là một số nguyên không âm",
        };
      }

      // Kiểm tra thời gian ca làm việc
      if (shiftStart && shiftEnd) {
        const startTime = shiftStart.hour * 60 + shiftStart.minute;
        const endTime = shiftEnd.hour * 60 + shiftEnd.minute;
        if (startTime >= endTime) {
          return {
            error: "Thời gian bắt đầu làm phải trước khi thời gian kết thúc",
          };
        }
      }

      // Kiểm tra định dạng email
      if (email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          return {
            error: "Email không đúng định dạng",
          };
        }
      }

      // Kiểm tra định dạng số điện thoại
      if (phone) {
        const phoneRegex = /^[0-9]{10}$/;
        if (!phoneRegex.test(phone)) {
          return {
            error: "Số điện thoại không đúng định dạng",
          };
        }
      }

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
      const user = await userModel
        .findOne({
          _id,
          deleted: false,
          role: "employee",
        })
        .lean();
      if (!user) {
        return {
          error: "Employee not found or has been deleted!",
        };
      }
      const roles =
        await PermissionImplement.getAllPermissionOfEmployeeFunction(user._id);
      user.roles = roles;
      return user;
    } catch (error) {
      console.error("Error fetching user by ID:", error);
      throw new Error("An error occurred while fetching the user.");
    }
  };

  static updateEmployeeAccount = async (id, accountInfo) => {
    const { account, password } = accountInfo;
    if (!account || !password) {
      throw customError("Vui lòng nhập đầy đủ các trường");
    }
    const employee = await userModel.findById(id);
    if (!employee) {
      throw customError("Không tìm thấy nhân viên!");
    }
    const accountExist = await userModel.findOne({
      account: account,
      role: "employee",
    });
    if (accountExist && accountExist._id.toString() !== id) {
      throw customError("Tài khoản đã tồn tại!");
    }
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return await userModel.findByIdAndUpdate(
      id,
      {
        account: account,
        password: hashedPassword,
      },
      { new: true }
    );
  };
  static deleteEmployeeAccount = async (id) => {
    return await userModel.findByIdAndUpdate(
      id,
      { account: null }, // Set account to null
      { new: true } // Return the updated document
    );
  };
  static getAllEmployeeAccount = async () => {
    return await userModel.find({
      role: "employee",
      account: { $ne: null, $exists: true }, // Ensures account is not null and exists
    });
  };
}
