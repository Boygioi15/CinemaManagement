import { customError } from "../middlewares/errorHandlers.js";
import promotionModel from "./promotion.schema.js";
import { handleDestroyCloudinary } from "../ulitilities/cloudinary.js";
export class PromotionService {
  // Hàm tạo phòng và tạo ghế liên kết
  static createPromotion = async ({
    name,
    thumbnailURL,
    public_ID,
    discountRate,
    beginDate,
    endDate,
  }) => {
    const newPromotion = await promotionModel.create({
      name,
      thumbnailURL,
      public_ID,
      discountRate,
      beginDate: new Date(beginDate),
      endDate: new Date(endDate),
    });
    return newPromotion;
  };

  static updatePromotion = async (id, updateData) => {
    const promotion = await promotionModel.findByIdAndUpdate(id, updateData, {
      new: true,
    });
    const oldPromotion = await promotionModel.findByIdAndUpdate(id, updateData);
    //destroy old img
    handleDestroyCloudinary(oldPromotion.public_ID);
    if (!promotion) throw customError("Not found promotion", 400);
    return promotion;
  };

  static pausePromotion = async (id) => {
    const promotion = await promotionModel.findByIdAndUpdate(
      id,
      {
        paused: true,
      },
      {
        new: true,
      }
    );

    if (!promotion) throw customError("Not found promotion", 400);

    return promotion;
  };

  static resumePromotion = async (id) => {
    const promotion = await promotionModel.findByIdAndUpdate(
      id,
      {
        paused: false,
      },
      {
        new: true,
      }
    );

    if (!promotion) throw customError("Not found promotion", 400);

    return promotion;
  };

  static getPromotionById = async (id) => {
    const promotion = await promotionModel.findById(id);

    if (!promotion) throw customError("Not found promotion", 400);

    return promotion;
  };

  static getAllPromotions = async () => {
    return await promotionModel.find({});
  };

  static getActivePromotion = async () => {
    const currentDate = new Date();
    const vietnamTime = new Date(currentDate.getTime() + 7 * 60 * 60 * 1000);
    console.log(
      "🚀 ~ PromotionService ~ getActivePromotion= ~ vietnamTime:",
      vietnamTime
    );

    const activePromotions = await promotionModel.find({
      paused: false,
      beginDate: {
        $lte: vietnamTime,
      },
      endDate: {
        $gte: vietnamTime,
      },
    });

    return activePromotions;
  };
}
