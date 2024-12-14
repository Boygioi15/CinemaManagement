import filmModel from "./film.schema.js";
import { customError } from "../middlewares/errorHandlers.js";
export class FilmService {
  // Lấy danh sách các bộ phim đang chiếu

  static getUpComingFilm = async () => {
    const upComingFilm = await filmModel
      .find({
        beginDate: {
          $gte: new Date(),
        },
        deleted: false,
      })
      .lean();
    return upComingFilm;
  };

  // Tạo mới một bộ phim
  static createFilm = async ({
    name,
    thumbnailURL,
    trailerURL,
    tagsRef,
    filmDuration,
    ageSymbol,
    ageValue,
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
      ageSymbol,
      ageValue,
      voice,
      originatedCountry,
      twoDthreeD,
      otherDescription,
      filmDescription,
      beginDate,
    });
    return createdFilm;
  };

  // Get nội dung chi tiết của phim (cho trang film detail)
  static getFilmDetail = async (filmId) => {
    const filmFound = await filmModel
      .findById(filmId)
      .populate("tagsRef", "name -_id")
      .select("-createdAt -updatedAt -deleted -__v");
    if (!filmFound) throw customError("Film not found", 400);
    return filmFound;
  };

  static getAllFilm = async () => {
    return await filmModel.find();
  };

  // Xóa một bộ phim
  static deleteFilmById = async (filmId) => {
    return await filmModel.findByIdAndUpdate(
      filmId,
      { deleted: true },
      { new: true }
    );
  };

  // Cập nhật thông tin của bộ phim
  static updateFilmById = async (filmId, updateData) => {
    const updatedFilm = await filmModel.findByIdAndUpdate(
      filmId,
      updateData,
      { new: true, runValidators: true } // Trả về document sau khi cập nhật và kiểm tra validation
    );
    if (!updatedFilm) throw customError("Film not found", 400);
    return updatedFilm;
  };
}
