import express from "express";
import filmController from "./film.controller.js";
import { upload } from "../middlewares/cloudinary_multer.js";
const router = express.Router();

router.post("/mark-deleted/:id", filmController.markFilmDeleted);
router.post("/restore/:id", filmController.restoreFilm);
router.post("", upload.single("thumbnailFile"), filmController.createFilm);
router.put("/:id", upload.single("thumbnailFile"), filmController.updateFilm);

router.get("", filmController.getAllFilms);
router.get("/allFilmNotDeleted", filmController.getAllFilmsNotDeleted);
router.get("/:id/getFilmDetail", filmController.getFilmDetail);

router.post("/searchFilm", filmController.searchFilm);

export default router;
