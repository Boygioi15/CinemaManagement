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

  // Hàm kiểm tra danh sách thể loại phim (tagsRef)
  static validateTags = async (tagsString) => {
    if (!tagsString) {
      throw customError("Tags cannot be empty.", 400);
    }
    // Tách chuỗi các thể loại phim thành mảng
    const tagsArray = tagsString.replace(/\s+/g, "").split(",");
    // Lấy danh sách tất cả các tags hợp lệ từ collection tags
    const existingTags = await TagModel.find({
      name: { $in: tagsArray }
    }).select("name -_id");
    const validTags = existingTags.map(tag => tag.name);
    // Kiểm tra xem có tag nào không hợp lệ
    const invalidTags = tagsArray.filter(tag => !validTags.includes(tag));
    if (invalidTags.length > 0) {
      throw customError(`Invalid tags: ${invalidTags.join(", ")}`, 400);
    }
    // Trả về danh sách các ObjectId tương ứng với các tags hợp lệ
    const validTagIds = await TagModel.find({
      name: { $in: tagsArray }
    }).select("_id");

    return validTagIds.map(tag => tag._id);
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
    const { tagsRef, ageValue, ageSymbol, twoDthreeD, ...rest } = filmData;
    // Kiểm tra tuổi
    FilmService.validateAgeRestriction(ageValue, ageSymbol);
    // Kiểm tra định dạng 2D, 3D
    const formattedTwoDthreeD = FilmService.isValid2D3DArray(twoDthreeD);
    // Kiểm tra các thể loại phim (tags)
    const validTagIds = await FilmService.validateTags(tagsRef);
    return await filmModel.create({
      ...rest,
      tagsRef: validTagIds,
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

  // Tương tự, cập nhật updateFilmById
  static updateFilmById = async (filmId, updateData) => {
    const { tagsRef, ageValue, ageSymbol, twoDthreeD, ...rest } = updateData;
    if (ageValue && ageSymbol) {
      FilmService.validateAgeRestriction(ageValue, ageSymbol);
    }
    const formattedTwoDthreeD = FilmService.isValid2D3DArray(twoDthreeD);
    const validTagIds = tagsRef
      ? await FilmService.validateTags(tagsRef)
      : undefined;
    const updatedFilm = await filmModel.findByIdAndUpdate(
      filmId,
      {
        ...rest,
        ...(formattedTwoDthreeD && { twoDthreeD: formattedTwoDthreeD }),
        ...(validTagIds && { tagsRef: validTagIds }),
        ...(ageValue && { ageValue }),
        ...(ageSymbol && { ageSymbol }),
      },
      { new: true, runValidators: true }
    );
    if (!updatedFilm) throw customError("Film not found", 400);
    return updatedFilm;
  };
}
