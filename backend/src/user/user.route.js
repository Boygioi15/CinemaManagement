import express from "express";
import { userController, employeeController } from "./user.controller.js";
import { validateToken } from "../middlewares/verifyToken.js";

const router = express.Router();

router.post("/user", userController.createUser);
router.put("/user/:id", userController.updateUser);
router.delete("/user/:id", userController.deleteUser);
router.get("/user/", userController.getAllUsers);
router.post("/user/:id/block", userController.blockUser);
router.post("/user/:id/unblock", userController.unblockUser);

// router.post("/user/reset-password", userController.resetPassword);
router.post("/user/change-password/:id", userController.changePassword);

router.post("/employee/", employeeController.createEmployee);
router.put("/employee/:id", employeeController.updateEmployee);
router.delete("/employee/:id", employeeController.deleteEmployee);
router.get("/employee/", employeeController.getAllEmployees);
router.get(
  "/employee/get-employee-detail/",
  validateToken,
  employeeController.getEmployeeByID
);
router.get("/employee/all-account", employeeController.getAllAccounts);

router.post("/employee/update-account/:id", employeeController.updateAccount);
router.delete("/employee/delete-account/:id", employeeController.deleteAccount);

export default router;
