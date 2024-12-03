import express from "express";
import roomController from "./room.controller.js";


const router = express.Router();

router.post("", roomController.createRoom);


export default router;