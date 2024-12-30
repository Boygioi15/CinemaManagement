import express from "express";
import { userController, employeeController } from "./user.controller.js";

const router = express.Router();

router.post("/user/", userController.createUser);
router.put("/user/:_id", userController.updateUser);
router.delete("/user/:_id", userController.deleteUser);
router.get("/user/", userController.getAllUsers);
// router.post("/user/reset-password", userController.resetPassword);
// router.post("/user/change-password/:id", userController.changePassword);

router.post("/employee/", employeeController.createEmployee);
router.put("/employee/:id", employeeController.updateEmployee);
router.delete("/employee/:id", employeeController.deleteEmployee);
router.get("/employee/", employeeController.getAllEmployees);
export default router;
