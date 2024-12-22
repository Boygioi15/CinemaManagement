import express from "express";
import seatController from "./seat.controller.js";


const router = express.Router();

router.post("/add-seat", seatController.addSeat);      
router.put("/:seatId", seatController.updateSeat);  
router.delete("/:seatId", seatController.deleteSeat);  
router.get("", seatController.getAllSeats);        
router.get("/:seatId", seatController.getSeatById); 

export default router;