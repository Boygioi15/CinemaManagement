import {
    FilmService
} from "../film/film.service.js";
import filmShowModel from "./filmShow.schema.js";

export class FilmShowService {
    static createFilmShow = async ({
        roomId,
        showTime,
        showDate,
        film
    }) => {
        // check showDate showtime  (Nhớ + thời lượng của phim)

        return await filmShowModel.create({
            roomId,
            showTime,
            showDate,
            film
        })
    };

    static getListFilmShowing = async () => {
        const filmShows = await filmShowModel.find({
            showDate: {
                $gte: new Date()
            }
        }).populate({
            path: 'film',
        }).lean();

        const uniqueFilms = [];

        filmShows.forEach(filmShow => {
            if (!uniqueFilms.some(film => film._id.toString() === filmShow.film._id.toString())) {
                uniqueFilms.push(filmShow.film);
            }
        });

        return uniqueFilms;
    };

    static getUpComingFilm = async () => {
        return await FilmService.getUpComingFilm()
    };

    static getShowtimesByDate = async (filmId, date) => {
        const selectedDate = new Date(date);
        const startOfDay = new Date(Date.UTC(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate(), 0, 0, 0));
        const endOfDay = new Date(Date.UTC(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate(), 23, 59, 59, 999));


        const showtimes = await filmShowModel.find({
                film: filmId,
                showDate: {
                    $gte: startOfDay,
                    $lt: endOfDay,
                }
            })
            .select('showTime _id')
            .lean();

        return showtimes;
    }


    static getAllFilmShowByFilmId = async (filmId) => {
        const filmShows = await filmShowModel.find({
            film: filmId,
            showDate: {
                $gte: new Date()
            },
        }).select('showDate').lean();

        const arrayShowDates = filmShows.map(item => item.showDate);

        const res = Promise.all(arrayShowDates.map(async (date) => {
            const showtimes = await this.getShowtimesByDate(filmId, date);
            return {
                date,
                showtimes
            };
        }))
        return res;
    }
}