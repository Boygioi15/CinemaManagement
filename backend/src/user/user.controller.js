import { customError } from "../middlewares/errorHandlers.js";
import { UserService, EmployeeService } from "./user.service.js";
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
    const { _id } = req.params;

    const updatedUser = await UserService.updateUserById(_id, req.body);

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
    const { _id } = req.params;
    const deletedUser = await UserService.deleteUserById(_id);
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

  changePassword = expressAsyncHandler(async (req, res, next) => {
    const { id } = req.params;

    const { oldPassword, newPassword, confirmNewPassword } = req.body;

    if (newPassword !== confirmNewPassword)
      throw customError("Mật khẩu mới không khớp");
    const update = await UserService.changePassword(id, {
      oldPassword,
      newPassword,
      confirmNewPassword,
    });
    return res.status(200).json({
      msg: "Update password successfully!",
      success: true,
      data: update,
    });
  });
}
class EmployeeController {
  createEmployee = expressAsyncHandler(async (req, res, next) => {
    const createdEmployee = await EmployeeService.createEmployee(req.body);
    if (createdEmployee?.error) {
      return res.status(400).json({
        msg: createdEmployee.error,
        success: false,
      });
    }
    return res.status(200).json({
      msg: "Tạo mới nhân viên thành công!",
      success: true,
      user: createdEmployee,
    });
  });

  updateEmployee = expressAsyncHandler(async (req, res, next) => {
    const { id } = req.params;

    const updatedEmployee = await EmployeeService.updateEmployeeById(
      { _id: id },
      req.body
    );

    if (updatedEmployee?.error) {
      return res.status(400).json({
        msg: updatedEmployee.error,
        success: false,
      });
    }
    if (!updatedEmployee) {
      return res.status(400).json({
        msg: "Không tìm thấy nhân viên!",
        success: false,
      });
    }
    return res.status(200).json({
      msg: "Cập nhật nhân viên thành công!",
      success: true,
      user: updatedEmployee,
    });
  });

  deleteEmployee = expressAsyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const deletedEmployee = await EmployeeService.deleteEmployeeById(id);
    if (!deletedEmployee) {
      return res.status(400).json({
        msg: "Không tìm thấy nhân viên!",
        success: false,
      });
    }
    res.status(200).json({
      msg: "Xóa nhân viên thành công!",
      success: true,
      user: deletedEmployee,
    });
  });

  getAllEmployees = expressAsyncHandler(async (req, res, next) => {
    const users = await EmployeeService.getAllEmployees();
    res.status(200).json({
      msg: "Get all employees successfully",
      data: users,
      success: true,
    });
  });
}
const userController = new UserController(),
  employeeController = new EmployeeController();
export { userController, employeeController };
