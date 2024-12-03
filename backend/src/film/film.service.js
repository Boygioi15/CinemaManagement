import filmModel from "./film.schema.js";

export class FilmService {
    // Lấy danh sách các bộ phim đang chiếu

    static getUpComingFilm = async () => {
        const upComingFilm = await filmModel.find({
            beginDate: {
                $gte: new Date()
            },
            deleted: false,
        }).lean();
        return upComingFilm;

    };

    // Tạo mới một bộ phim
    static createFilm = async ({
        name,
        thumbnailURL,
        trailerURL,
        tagsRef,
        filmDuration,
        ageRestrictionRef,
        voice,
        originatedCountry,
        twoDthreeD,
        otherDescription,
        filmDescription,
        beginDate,
    }) => {

        const createdFilm = await filmModel.create({
            name,
            thumbnailURL,
            trailerURL,
            tagsRef,
            filmDuration,
            ageRestrictionRef,
            voice,
            originatedCountry,
            twoDthreeD,
            otherDescription,
            filmDescription,
            beginDate,
        });
        return createdFilm;


    };
}