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


    getAllFilmShow = expressAsyncHandler(async (req, res, next) => {
        const {
            filmId
        } = req.query;
        const response = await FilmShowService.getAllFilmShowByFilmId(filmId)
        return res.status(200).json({
            msg: "Get showdate successfully!",
            success: true,
            data: response
        });
    });

    getHostRoom = expressAsyncHandler(async (req, res, next) => {
        const {
            id
        } = req.params;
        const response = await FilmShowService.getHostRoomOfFilmShow(id)
        return res.status(200).json({
            msg: "Get showdate successfully!",
            success: true,
            data: response
        });
    });
}

export default new FilmShowController()