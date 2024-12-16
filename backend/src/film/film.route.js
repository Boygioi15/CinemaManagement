import express from "express";
import filmController from "./film.controller.js";
import { upload } from "../middlewares/cloudinary_multer.js";
const router = express.Router();

router.post("", upload.single("uploaded_file"), filmController.createFilm);
router.post("", filmController.createFilm);
router.put("/:id", filmController.updateFilm);
router.delete("/:id", filmController.deleteFilm);
router.get("", filmController.getAllFilms);
router.get("/:id/getFilmDetail", filmController.getFilmDetail);

export default router;
