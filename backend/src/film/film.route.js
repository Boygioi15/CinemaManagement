import express from "express";
import filmController from "./film.controller.js";
import {
    upload
} from "../middlewares/cloudinary_multer.js";
const router = express.Router();

router.post("", upload.single("thumbnailFile"), filmController.createFilm);
router.put("/:id", upload.single("thumbnailFile"), filmController.updateFilm);
//router.delete("/:id", filmController.deleteFilm);
router.get("", filmController.getAllFilms);
router.get("/:id/getFilmDetail", filmController.getFilmDetail);

router.post("/searchFilm", filmController.searchFilm);

export default router;