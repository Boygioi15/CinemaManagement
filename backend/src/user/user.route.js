import express from "express";
import userController from "./user.controller.js";

const router = express.Router();

router.post("/", userController.createUser);
router.put("/:_id", userController.updateUser);
router.delete("/:_id", userController.deleteUser);
router.get("/", userController.getAllUsers);
router.post("/reset-password", userController.resetPassword);

export default router;
