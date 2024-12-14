import expressAsyncHandler from "express-async-handler";
import { FilmService } from "./film.service.js";

class FilmController {
  createFilm = expressAsyncHandler(async (req, res, next) => {
    const response = await FilmService.createFilm(req.body);
    return res.status(200).json({
      msg: "Create film successfully!",
      success: true,
      data: response,
    });
  });

  getAllFilms = expressAsyncHandler(async (req, res, next) => {
    const response = await FilmService.getAllFilm();
    return res.status(200).json({
      msg: "Get all film successfully!",
      success: true,
      data: response,
    });
  });
  getFilmDetail = expressAsyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const response = await FilmService.getFilmDetail(id);
    return res.status(200).json({
      msg: "Get film successfully!",
      success: true,
      data: response,
    });
  });
}

export default new FilmController();
