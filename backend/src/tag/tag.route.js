import express from "express";
import tagController from "./tag.controller.js";

const router = express.Router();

router.post("", tagController.CreateTag);
router.get("", tagController.GetAllTag);

export default router;
