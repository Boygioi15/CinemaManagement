import express from "express";
import tagController from "./tag.controller.js";

const router = express.Router();

router.post("", tagController.CreateTag);
router.get("", tagController.GetAllTag);
router.delete("/:tagId", tagController.DeleteTag);

export default router;
