import express from "express";
import filmShowController from "./filmShow.controller.js";


const router = express.Router();

router.post("", filmShowController.createFilmShow);
router.get("/showing", filmShowController.showingFilm);
router.get("/upcoming", filmShowController.showingFilm);
router.get('/:filmId/show-date', filmShowController.getFilmShowDates);
router.get('/:filmId/show-time', filmShowController.getFilmShowTimes);


export default router;