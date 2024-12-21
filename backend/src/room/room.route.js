import express from "express";
import roomController from "./room.controller.js";

const router = express.Router();

router.post("", roomController.createRoom);
router.get("", roomController.getAllRooms);
router.get("/:id", roomController.getRoomDetail);
router.delete("", roomController.deleteAllRooms);

export default router;
