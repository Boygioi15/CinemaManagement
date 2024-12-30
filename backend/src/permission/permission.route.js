import express from "express";
import PermissionImplement from "./permission.implementation.js";

const router = express.Router();

router.post("/add-permission", PermissionImplement.createPermission);
router.get("/get-all-permission", PermissionImplement.getAllPermission);
router.delete("/delete-permission/:id", PermissionImplement.deletePermission);
router.delete(
  "/delete-all-permission",
  PermissionImplement.deleteAllPermission
);
router.post(
  "/add-permission-to-employee/:employeeID/:permissionID",
  PermissionImplement.addPermissionToEmployee
);
router.delete(
  "/delete-permission-of-employee/:employeeID/:permissionID",
  PermissionImplement.deletePermissionOfEmployee
);
router.get(
  "/get-all-permission-of-employee/:id",
  PermissionImplement.getAllPermissionOfEmployee
);
export default router;
