import express from "express";
import roomController from "./room.controller.js";


const router = express.Router();

router.post("", roomController.createRoom);
router.get("", roomController.getAllRooms);
router.get("/:roomId", roomController.getRoomById);
router.put("/:roomId", roomController.updateRoom);
router.delete("/:roomId", roomController.deleteRoom);

export default router;