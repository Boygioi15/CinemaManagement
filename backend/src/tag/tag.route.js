import express from "express";
import tagController from "./tag.controller.js";


const router = express.Router();

router.post("", tagController.CreateTag);


export default router;