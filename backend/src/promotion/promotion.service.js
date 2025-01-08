import {
  customError
} from "../middlewares/errorHandlers.js";
import promotionModel from "./promotion.schema.js";

export class PromotionService {
  // Hàm tạo phòng và tạo ghế liên kết
  static createPromotion = async ({
    name,
    thumbnailURL,
    public_ID,
    discountRate,
    beginDate,
    endDate
  }) => {
    const newPromotion = await promotionModel.create({
      name,
      thumbnailURL,
      public_ID,
      discountRate,
      beginDate: new Date(beginDate),
      endDate: new Date(endDate)
    });
    return newPromotion

  };

  static updatePromotion = async (id, updateData) => {
    const promotion = await promotionModel.findByIdAndUpdate(
      id,
      updateData, {
        new: true
      }
    );

    if (!promotion) throw customError("Not found promotion", 400)

    return promotion
  }

  static pausePromotion = async (id) => {
    const promotion = await promotionModel.findByIdAndUpdate(
      id, {
        paused: true
      }, {
        new: true
      }
    );

    if (!promotion) throw customError("Not found promotion", 400)

    return promotion
  }

  static resumePromotion = async (id) => {
    const promotion = await promotionModel.findByIdAndUpdate(
      id, {
        paused: false
      }, {
        new: true
      }
    );

    if (!promotion) throw customError("Not found promotion", 400)

    return promotion
  }

  static getPromotionById = async (id) => {
    const promotion = await promotionModel.findById(id);

    if (!promotion) throw customError("Not found promotion", 400)

    return promotion
  }


  static getAllPromotions = async () => {
    return await promotionModel.find({});
  }

  getAllPromotions = async () => {
    const currentDate = new Date();

    const activePromotions = await promotionModel.find({
      paused: false,
      beginDate: {
        $lte: currentDate
      },
      endDate: {
        $gte: currentDate
      }
    });

    return activePromotions
  }

};