import express from "express";
import userController from "./user.controller.js";

const router = express.Router();

router.post("/create-user", userController.createUser);
router.put("/update-user/:userId", userController.updateUser);
router.delete("/delete-user/:userId", userController.deleteUser);
router.get("/get-all-users", userController.getAllUsers);
router.post("/reset-password", userController.resetPassword);



export default router;