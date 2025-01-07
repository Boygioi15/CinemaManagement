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
      throw customError("Dữ liệu giới hạn tuổi không hợp lệ", 400);
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
      .find({
        _id: {
          $in: tagIDs,
        },
      })
      .select("_id");
    // Compare the number of matching tags with the input tagIDs
    if (tagsInDB.length !== tagIDs.length) {
      throw customError("Dữ liệu thể loại phim không hợp lệ", 400);
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
    const { tagsRef, ageRestriction, twoDthreeD, filmDuration, ...rest } =
      filmData;
    const tagsArray = JSON.parse(tagsRef);
    //console.log(filmData);
    // Kiểm tra tuổi
    await FilmService.validateAgeRestriction(ageRestriction);
    // Kiểm tra định dạng 2D, 3D
    const formattedTwoDthreeD = await FilmService.isValid2D3DArray(twoDthreeD);
    // Kiểm tra các thể loại phim (tags)
    await FilmService.validateTags(tagsArray);

    if (filmDuration < 0) {
      throw customError("Thời lượng phim phải là một số nguyên không âm", 400);
    }
    if (filmDuration > 1000) {
      throw customError("Thời lượng phim phải không được vượt quá 1000!", 400);
    }
    
    return await filmModel.create({
      ...rest,
      filmDuration,
      tagsRef: tagsArray,
      ageRestriction,
      twoDthreeD: formattedTwoDthreeD,
    });
  };

  // Get nội dung chi tiết của phim (cho trang film detail)
  static getFilmDetail = async (filmId) => {
    console.log(filmId);

    const filmFound = await filmModel
      .findById(filmId)
      .populate("tagsRef", "name -_id")
      .select("-createdAt -updatedAt -deleted -__v");
    if (!filmFound) return null;
    return filmFound;
  };

  static getAllFilm = async () => {
    return await filmModel
      .find()
      .sort({ deleted: 1, createdAt: -1 }) // Prioritize `deleted: false`, then sort by `createdAt`
      .lean();
  };
  static getAllFilmNotDeleted = async () => {
    return await filmModel.find({
      deleted: false,
    });
  };
  // Xóa một bộ phim
  static deleteFilmById = async (filmId) => {
    const oldFilm = await filmModel.findById(filmId);
    console.log(oldFilm);
    return await filmModel.findByIdAndUpdate(
      filmId,
      {
        name: "(Đã xóa)" + oldFilm.name,
        deleted: true,
      },
      {
        new: true,
      }
    );
  };
  static restoreFilmById = async (filmId) => {
    const oldFilm = await filmModel.findById(filmId);
    console.log(oldFilm);
    return await filmModel.findByIdAndUpdate(
      filmId,
      {
        name: oldFilm.name.replace(/^\(Đã xóa\)\s*/, ""),
        deleted: false,
      },
      {
        new: true,
      }
    );
  };

  // Cập nhật 1 bộ phim
  static updateFilmById = async (filmId, updateData) => {
    const { tagsRef, ageRestriction, twoDthreeD, filmDuration, ...rest } = updateData;
    const tagsArray = JSON.parse(tagsRef);
    // Kiểm tra tuổi
    await FilmService.validateAgeRestriction(ageRestriction);
    // Kiểm tra định dạng 2D, 3D
    const formattedTwoDthreeD = await FilmService.isValid2D3DArray(twoDthreeD);
    // Kiểm tra thể loại phim
    await FilmService.validateTags(tagsArray);

    // Kiểm tra thời lượng phim
    if (filmDuration < 0) {
      throw customError("Thời lượng phim phải là một số nguyên không âm", 400);
    }
    if (filmDuration > 1000) {
      throw customError("Thời lượng phim phải không được vượt quá 1000!", 400);
    }

    const oldFilm = await filmModel.findByIdAndUpdate(filmId, {
      ...rest,
      tagsRef: tagsArray,
      ageRestriction,
      twoDthreeD: formattedTwoDthreeD,
    });
    //destroy old img
    handleDestroyCloudinary(oldFilm.public_ID);
  };

  static async searchFilms(keyword = "", page = 1, limit = 3) {
    try {
      if (!keyword.trim()) {
        throw new Error("Search keyword is required");
      }

      const skip = (page - 1) * limit;

      const pipeline = [
        {
          $lookup: {
            from: "tags",
            localField: "tagsRef",
            foreignField: "_id",
            as: "tags",
          },
        },
        {
          $match: {
            deleted: false,
            $or: [
              {
                name: {
                  $regex: keyword,
                  $options: "i",
                },
              },
              {
                filmContent: {
                  $regex: keyword,
                  $options: "i",
                },
              },
              {
                "tags.name": {
                  $regex: keyword,
                  $options: "i",
                },
              },
            ],
          },
        },
        {
          $project: {
            name: 1,
            thumbnailURL: 1,
            filmContent: 1,
            trailerURL: 1,
            filmDuration: 1,
            beginDate: 1,
            filmDescription: 1,
            ageRestriction: 1,
            originatedCountry: 1,
            twoDthreeD: 1,
            voice: 1,
            tags: {
              _id: 1,
              name: 1,
            },
          },
        },
        {
          $facet: {
            metadata: [
              {
                $count: "total",
              },
              {
                $addFields: {
                  currentPage: page,
                  totalPages: {
                    $ceil: {
                      $divide: ["$total", limit],
                    },
                  },
                },
              },
            ],
            films: [
              {
                $skip: skip,
              },
              {
                $limit: limit,
              },
            ],
          },
        },
      ];

      const [result] = await filmModel.aggregate(pipeline);

      return {
        films: result.films,
        metadata: result.metadata[0] || {
          total: 0,
          currentPage: page,
          totalPages: 0,
        },
      };
    } catch (error) {
      throw new Error(`Error searching films: ${error.message}`);
    }
  }
}
