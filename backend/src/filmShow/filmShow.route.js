import express from "express";
import filmShowController from "./filmShow.controller.js";

const router = express.Router();

router.post("", filmShowController.createFilmShow);
router.get("/showing", filmShowController.showingFilm);
router.get("/upcoming", filmShowController.upComingFilm);
router.get("/getByDate", filmShowController.getAllFilmShowByFilmId);
router.get("/getAll", filmShowController.getAllFilmShow);
router.get("/:id", filmShowController.getFilmShow);
router.get("/:id/getHostRoom", filmShowController.getHostRoom);
router.post("/:id/refresh-locked-seat", filmShowController.refreshLockedSeat);
router.get("/get-available/showDate", filmShowController.getAvailableShowDate);
router.post(
  "/get-film-available-by-date",
  filmShowController.getAvailableFilmByDate
);
router.post("/cancel-filmShow/:id", filmShowController.cancelFilmShow);
export default router;
