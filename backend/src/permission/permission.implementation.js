import { customError } from "../middlewares/errorHandlers.js";
import userModel from "../user/user.schema.js";
import {
  Employee_PermissionModel,
  PermissionModel,
} from "./permission.schema.js";
import expressAsyncHandler from "express-async-handler";
export default class PermissionImplement {
  static createPermission = expressAsyncHandler(async (req, res, err) => {
    console.log("HO");
    try {
      const permission = await PermissionModel.create(req.body);
      return res.status(200).json({
        message: "permission have been created successfully.",
        data: permission,
      });
    } catch (error) {
      return res.status(500).json({
        message: "Failed to create order.",
        err: error,
      });
    }
  });
  static deletePermission = expressAsyncHandler(async (req, res, err) => {
    const { id } = req.params;
    try {
      const permission = await PermissionModel.findByIdAndDelete(id);
      return res.status(200).json({
        message: "Permission have been deleted successfully.",
        data: permission,
      });
    } catch (error) {
      return res.status(500).json({
        message: "Failed to deleted permission.",
        err: error,
      });
    }
  });
  static getAllPermission = expressAsyncHandler(async (req, res, err) => {
    res.status(200).json({
      data: await PermissionModel.find(),
    });
  });
  static deleteAllPermission = expressAsyncHandler(async (req, res, err) => {
    res.status(200).json({
      data: await PermissionModel.deleteMany(),
    });
  });
  static updateEmployeePermission = expressAsyncHandler(
    async (req, res, err) => {
      const { employeeID } = req.params;
      const { permissionList } = req.body;
      console.log(permissionList);
      if (!permissionList) {
        throw customError("Sai định dạng request");
      }
      const uniquePermissions = new Set(permissionList);

      if (uniquePermissions.size !== permissionList.length) {
        throw customError("Bị trùng quyền?", 400);
      }

      try {
        if (
          !(await userModel.findOne({
            role: "employee",
            _id: employeeID,
          }))
        ) {
          throw customError("Nhân viên không tồn tại!", 400);
        }
      } catch (error) {
        throw customError(
          "Định dạng mã nhân viên không hợp lệ! Lỗi: " + error,
          400
        );
      }
      for (const permissionID of permissionList) {
        if (!(await PermissionModel.findById(permissionID))) {
          throw customError("Quyền không tồn tại", 400);
        }
      }
      try {
        const result = await Employee_PermissionModel.deleteMany({
          employeeID: employeeID,
        });
        console.log(result);
      } catch (error) {
        console.log(error);
        throw customError(
          "Lỗi bất ngờ khi thực hiện cập nhật quyền nhân viên!"
        );
      }
      try {
        for (const permissionID of permissionList) {
          await Employee_PermissionModel.create({
            employeeID: employeeID,
            permissionID: permissionID,
          });
        }
      } catch (error) {
        console.log(error);
        throw customError(
          "Lỗi bất ngờ khi thực hiện cập nhật quyền nhân viên!"
        );
      }
      res.status(200).json({
        msg: "Update employee permission successfully",
        success: "true",
      });
    }
  );
  static addPermissionToEmployee = expressAsyncHandler(
    async (req, res, err) => {
      const { employeeID, permissionID } = req.params;
      try {
        if (
          !(await userModel.findOne({
            role: "employee",
            _id: employeeID,
          }))
        ) {
          throw customError("Nhân viên không tồn tại!", 400);
        }
      } catch (error) {
        throw customError(
          "Định dạng mã nhân viên không hợp lệ! Lỗi: " + error,
          400
        );
      }
      if (!(await PermissionModel.findById(permissionID))) {
        throw customError("Quyền không tồn tại", 400);
      }
      if (
        await Employee_PermissionModel.findOne({
          employeeID: employeeID,
          permissionID: permissionID,
        })
      ) {
        throw customError("Nhân viên đã có quyền này!", 400);
      }
      const result = await Employee_PermissionModel.create({
        employeeID: employeeID,
        permissionID: permissionID,
      });
      res.status(200).json({
        data: result,
      });
    }
  );
  static deletePermissionOfEmployee = expressAsyncHandler(
    async (req, res, err) => {
      const { employeeID, permissionID } = req.params;
      try {
        if (
          !(await userModel.findOne({
            role: "employee",
            _id: employeeID,
          }))
        ) {
          throw customError("Nhân viên không tồn tại!", 400);
        }
      } catch {
        throw customError("Định dạng mã nhân viên không hợp lệ!", 400);
      }
      if (!(await PermissionModel.findById(permissionID))) {
        throw customError("Quyền không tồn tại", 400);
      }
      if (
        !(await Employee_PermissionModel.findOne({
          employeeID: employeeID,
          permissionID: permissionID,
        }))
      ) {
        throw customError("Nhân viên chưa có quyền này!", 400);
      }
      const result = await Employee_PermissionModel.deleteMany({
        employeeID: employeeID,
        permissionID: permissionID,
      });
      res.status(200).json({
        data: result,
      });
    }
  );
  static getAllPermissionOfEmployee = expressAsyncHandler(
    async (req, res, err) => {
      const { id } = req.params;
      try {
        if (
          !(await userModel.findOne({
            role: "employee",
            _id: id,
          }))
        ) {
          throw customError("Nhân viên không tồn tại!", 400);
        }
      } catch (error) {
        throw customError(
          "Định dạng mã nhân viên không hợp lệ! Lỗi: " + error,
          400
        );
      }
      const result = await Employee_PermissionModel.find({
        employeeID: id,
      }).populate({
        path: "permissionID",
        select: "name symbol",
        model: "permissions",
      });
      res.status(200).json({
        data: result,
      });
    }
  );
  static getAllPermissionOfEmployeeFunction = async (id) => {
    try {
      if (
        !(await userModel.findOne({
          role: "employee",
          _id: id,
        }))
      ) {
        throw customError("Nhân viên không tồn tại!", 400);
      }
    } catch (error) {
      throw customError(
        "Định dạng mã nhân viên không hợp lệ! Lỗi: " + error,
        400
      );
    }
    const result = await Employee_PermissionModel.find({
      employeeID: id,
    }).populate({
      path: "permissionID",
      select: "name symbol",
      model: "permissions",
    });
    return result;
  };
}
