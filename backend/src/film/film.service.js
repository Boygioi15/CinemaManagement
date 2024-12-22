import filmModel from "./film.schema.js";
import { AgeRestrictionModel } from "../param/param.schema.js";
import { customError } from "../middlewares/errorHandlers.js";
import mongoose from "mongoose";
import tagModel from "../tag/tag.schema.js";
import { handleDestroyCloudinary } from "../ulitilities/cloudinary.js";

export class FilmService {
  // Hàm kiểm tra ageValue và ageSymbol
  static validateAgeRestriction = async (ageName) => {
    const ageRestriction = await AgeRestrictionModel.findOne({
      name: ageName,
    });

    if (!ageRestriction) {
      throw customError("Giới hạn tuổi không hợp lệ", 400);
    }
  };

  // Hàm kiểm tra mảng twoDthreeD
  static isValid2D3DArray = (array) => {
    if (!array) {
      // Kiểm tra nếu array không có giá trị (undefined, null hoặc rỗng)
      throw customError("twoDthreeD is required and cannot be empty.", 400);
    }
    const values = array.replace(/\s+/g, "").split(","); // Xóa khoảng trắng và tách chuỗi thành mảng
    const allowedValues = ["2D", "3D"]; // Các giá trị hợp lệ
    if (
      values.length > 2 ||
      values.some((value) => !allowedValues.includes(value))
    ) {
      throw customError(
        "twoDthreeD must contain only '2D', '3D' or '2D,3D'.",
        400
      );
    }
    return values;
  };

  static validateTags = async (tagIDs) => {
    if (!tagIDs) {
      throw customError("Không được để trống danh mục phim!", 400);
    }
    // Fetch tags from the database that match the tagIDs
    const tagsInDB = await tagModel
      .find({ _id: { $in: tagIDs } })
      .select("_id");
    // Compare the number of matching tags with the input tagIDs
    if (tagsInDB.length !== tagIDs.length) {
      throw customError("Các danh mục không hợp lệ!", 404);
    }
    return true; // All tags are valid
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
    const { tagsRef, ageRestriction, twoDthreeD, ...rest } = filmData;
    const tagsArray = JSON.parse(tagsRef);
    //console.log(filmData);
    // Kiểm tra tuổi
    await FilmService.validateAgeRestriction(ageRestriction);
    // Kiểm tra định dạng 2D, 3D
    const formattedTwoDthreeD = await FilmService.isValid2D3DArray(twoDthreeD);
    // Kiểm tra các thể loại phim (tags)
    await FilmService.validateTags(tagsArray);
    return await filmModel.create({
      ...rest,
      tagsRef: tagsArray,
      ageRestriction,
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
    const { tagsRef, ageRestriction, twoDthreeD, ...rest } = updateData;
    const tagsArray = JSON.parse(tagsRef);
    // Kiểm tra tuổi
    await FilmService.validateAgeRestriction(ageRestriction);
    const formattedTwoDthreeD = await FilmService.isValid2D3DArray(twoDthreeD);
    await FilmService.validateTags(tagsArray);
    const oldFilm = await filmModel.findByIdAndUpdate(filmId, {
      ...rest,
      tagsRef: tagsArray,
      ageRestriction,
      twoDthreeD: formattedTwoDthreeD,
    });
    //destroy old img
    handleDestroyCloudinary(oldFilm.public_ID);
  };
}
