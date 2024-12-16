import express from "express";
import filmController from "./film.controller.js";
import { upload } from "../middlewares/cloudinary_multer.js";
const router = express.Router();

router.post("", upload.single("uploaded_file"), filmController.createFilm);
router.get("", filmController.getAllFilms);
router.get("/:id/getFilmDetail", filmController.getFilmDetail);

export default router;
