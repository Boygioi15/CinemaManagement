import expressAsyncHandler from "express-async-handler";
import { FilmShowService } from "./filmShow.service.js";
import filmModel from "../film/film.schema.js";
import filmShowModel from "./filmShow.schema.js";

class FilmShowController {
  createFilmShow = expressAsyncHandler(async (req, res, next) => {
    const response = await FilmShowService.createFilmShow(req.body);
    return res.status(200).json({
      msg: "Create film show successfully!",
      success: true,
      data: response,
    });
  });

  showingFilm = expressAsyncHandler(async (req, res, next) => {
    const response = await FilmShowService.getListFilmShowing();
    return res.status(200).json({
      msg: "Get showing film successfully!",
      success: true,
      data: response,
    });
  });

  upComingFilm = expressAsyncHandler(async (req, res, next) => {
    const response = await FilmShowService.getUpComingFilm();
    return res.status(200).json({
      msg: "Get upcoming film successfully!",
      success: true,
      data: response,
    });
  });

  getAllFilmShowByFilmId = expressAsyncHandler(async (req, res, next) => {
    const { filmId } = req.query;

    const response = await FilmShowService.getAllFilmShowByFilmId(filmId);

    return res.status(200).json({
      msg: "Get showdate successfully!",
      success: true,
      data: response,
    });
  });
  getFilmShow = expressAsyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const response = await FilmShowService.getFilmShow(id);
    return res.status(200).json({
      msg: "Get film show successfully!",
      success: true,
      data: response,
    });
  });
  getAllFilmShow = expressAsyncHandler(async (req, res, next) => {
    const original = await filmShowModel.find();
    const response = original.map(async (element) => {
      const film = await filmModel.findById(element.film.toString());
      //console.log(element.film.toString());
      return {
        ...element,
        filmName: film.filmName,
        ageRestriction: film.ageRestriction,
        duration: film.duration,
        originatedCounter: film.originatedCountry,
      };
    });
    return res.status(200).json({
      msg: "Get film show successfully!",
      success: true,
      data: response,
    });
  });

  getHostRoom = expressAsyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const response = await FilmShowService.getHostRoomOfFilmShow(id);
    return res.status(200).json({
      msg: "Get showdate successfully!",
      success: true,
      data: response,
    });
  });

  refreshLockedSeat = expressAsyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const response = await FilmShowService.refreshLockedSeat(id);
    return res.status(200).json({
      msg: "Refresh successfully!",
      success: true,
      data: response,
    });
  });

  getAllFilmShow = expressAsyncHandler(async (req, res, next) => {
    const response = await FilmShowService.getAllFilmShows();
    return res.status(200).json({
      msg: "Get all film shows successfully!",
      success: true,
      data: response,
    });
  });

  getAvailableShowDate = expressAsyncHandler(async (req, res, next) => {
    const response = await FilmShowService.getAvailableShowDate();
    return res.status(200).json({
      msg: "Get showdate successfully!",
      success: true,
      data: response,
    });
  });

  getAvailableFilmByDate = expressAsyncHandler(async (req, res, next) => {
    const response = await FilmShowService.getAvailableFilmByDate({
      ...req.body,
    });
    return res.status(200).json({
      msg: "Get showdate successfully!",
      success: true,
      data: response,
    });
  });

  cancelFilmShow = expressAsyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const response = await FilmShowService.cancelFilmShow(id);
    return res.status(200).json({
      msg: "Cancel film show successfully!",
      success: true,
      data: response,
    });
  });
}

export default new FilmShowController();
