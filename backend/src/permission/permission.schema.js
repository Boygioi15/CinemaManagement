import mongoose, { Types } from "mongoose";

const PermissionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  symbol: {
    type: String,
    required: true,
  },
});
const Employee_PermissionSchema = new mongoose.Schema({
  permissionID: {
    type: Types.ObjectId,
    ref: "permissions",
    required: true,
  },
  employeeID: {
    type: Types.ObjectId,
    ref: "employees",
    required: true,
  },
});
const PermissionModel = mongoose.model("permissions", PermissionSchema);
const Employee_PermissionModel = mongoose.model(
  "employee_permission",
  Employee_PermissionSchema
);

export { PermissionModel, Employee_PermissionModel };
