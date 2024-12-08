import expressAsyncHandler from "express-async-handler";
import {
    FilmShowService
} from "./filmShow.service.js";

class FilmShowController {
    createFilmShow = expressAsyncHandler(async (req, res, next) => {
        const response = await FilmShowService.createFilmShow(req.body)
        return res.status(200).json({
            msg: "Create film show successfully!",
            success: true,
            data: response
        });
    });

    showingFilm = expressAsyncHandler(async (req, res, next) => {
        const response = await FilmShowService.getListFilmShowing()
        return res.status(200).json({
            msg: "Get showing film successfully!",
            success: true,
            data: response
        });
    });

    upComingFilm = expressAsyncHandler(async (req, res, next) => {
        const response = await FilmShowService.getUpComingFilm()
        return res.status(200).json({
            msg: "Get upcoming film successfully!",
            success: true,
            data: response
        });
    });

    getFilmShowDates = expressAsyncHandler(async (req, res, next) => {
        const response = await FilmShowService.getFilmShowDates(req.params.filmId)
        return res.status(200).json({
            msg: "Get showdate successfully!",
            success: true,
            data: response
        });
    });

    getFilmShowTimes = expressAsyncHandler(async (req, res, next) => {
        const {
            filmId
        } = req.params;
        const {
            date // yyyy-mm-dd (2024-12-15) 
        } = req.query;

        const response = await FilmShowService.getShowtimesByFilmIdAndDate(
            filmId,
            date
        )
        return res.status(200).json({
            msg: "Get showdate successfully!",
            success: true,
            data: response
        });
    });
}

export default new FilmShowController()