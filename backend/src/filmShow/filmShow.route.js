import express from "express";
import filmShowController from "./filmShow.controller.js";

const router = express.Router();

router.post("", filmShowController.createFilmShow);
router.get("/showing", filmShowController.showingFilm);
router.get("/upcoming", filmShowController.showingFilm);
router.get("/getByDate", filmShowController.getAllFilmShowByFilmId);
router.get("/:id", filmShowController.getFilmShow);
router.get("/:id/getHostRoom", filmShowController.getHostRoom);
router.get("/all", filmShowController.getAllFilmShow);
router.post("/:id/refresh-locked-seat", filmShowController.refreshLockedSeat);

export default router;
