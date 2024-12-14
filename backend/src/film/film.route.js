import express from "express";
import filmController from "./film.controller.js";

const router = express.Router();

router.post("", filmController.createFilm);
router.put("/:id", filmController.updateFilm);
router.delete("/:id", filmController.deleteFilm);
router.get("", filmController.getAllFilms);
router.get("/:id/getFilmDetail", filmController.getFilmDetail);

export default router;
