import filmModel from "./film.schema.js";
import { AgeRestrictionModel } from "../param/param.schema.js";
import { customError } from "../middlewares/errorHandlers.js";
import mongoose from "mongoose";

export class FilmService {
  // Hàm kiểm tra ageValue và ageSymbol
  static validateAgeRestriction = async (ageValue, ageSymbol) => {
    const ageRestriction = await AgeRestrictionModel.findOne({
      value: ageValue,
      symbol: ageSymbol,
    });

    if (!ageRestriction) {
      throw customError("Invalid ageValue or ageSymbol.", 400);
    }
  };

  // Hàm kiểm tra mảng twoDthreeD
  static isValid2D3DArray = (array) => {
    if (!array) { // Kiểm tra nếu array không có giá trị (undefined, null hoặc rỗng)
      throw customError("twoDthreeD is required and cannot be empty.", 400);
    }
    const values = array.replace(/\s+/g, '').split(','); // Xóa khoảng trắng và tách chuỗi thành mảng
    const allowedValues = ['2D', '3D']; // Các giá trị hợp lệ
    if (
      values.length > 2 ||
      values.some((value) => !allowedValues.includes(value))
    ) {
      throw customError("twoDthreeD must contain only '2D', '3D' or '2D,3D'.", 400);
    }
    return values;
  };

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
  static createFilm = async (filmData) => {
    const { ageValue, ageSymbol, twoDthreeD, ...rest } = filmData;
    FilmService.validateAgeRestriction(ageValue, ageSymbol);
    const formattedTwoDthreeD = FilmService.isValid2D3DArray(twoDthreeD);
    return await filmModel.create({
      ...rest,
      ageValue,
      ageSymbol,
      twoDthreeD: formattedTwoDthreeD,
    });
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
    return await filmModel.find({ deleted: false });
  };

  // Xóa một bộ phim
  static deleteFilmById = async (filmId) => {
    return await filmModel.findByIdAndUpdate(
      filmId,
      { deleted: true },
      { new: true }
    );
  };

  // Cập nhật thông tin bộ phim
  static updateFilmById = async (filmId, updateData) => {
    const { ageValue, ageSymbol, twoDthreeD, ...rest } = updateData;
    if (ageValue && ageSymbol) {
      FilmService.validateAgeRestriction(ageValue, ageSymbol);
    }
    const formattedTwoDthreeD = FilmService.isValid2D3DArray(twoDthreeD);
    const updatedFilm = await filmModel.findByIdAndUpdate(
      filmId,
      {
        ...rest,
        ...(formattedTwoDthreeD && { twoDthreeD: formattedTwoDthreeD }),
        ...(ageValue && { ageValue }),
        ...(ageSymbol && { ageSymbol }),
      },
      { new: true, runValidators: true }
    );
    if (!updatedFilm) throw customError("Film not found", 400);
    return updatedFilm;
  };
}
