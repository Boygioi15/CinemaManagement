import {
  customError
} from "../middlewares/errorHandlers.js";
import promotionModel from "./promotion.schema.js";
import {
  handleDestroyCloudinary
} from "../ulitilities/cloudinary.js";
import {
  ParamModel
} from "../param/param.schema.js";
import {
  ParamService
} from "../param/param.service.js";
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
    // Kiểm tra tên sự kiện duy nhất
    const existingPromotion = await promotionModel.findOne({
      name
    });
    if (existingPromotion) {
      throw customError("Đã có chương trình sự kiện khác có tên này", 400);
    }
    //Kiểm tra tỉ lệ giảm giá
    if (discountRate <= 0 || discountRate > 100) {
      throw customError("Tỉ lệ giảm giá phải lớn hơn 0 và nhỏ hơn 100", 400);
    }
    //Kiểm tra ngày bắt đầu
    const releaseDate = new Date(beginDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (releaseDate < today) {
      throw customError("Ngày bắt đầu phải lớn hơn hoặc bằng ngày hiện tại", 400);
    }
    // Kiểm tra ngày bắt đầu và ngày kết thúc
    const beginDateTemp = new Date(beginDate);
    const endDateTemp = new Date(endDate);
    if (beginDateTemp > endDateTemp) {
      throw customError("Ngày bắt đầu phải nhỏ hơn hoặc bằng ngày kết thúc", 400);
    }

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
    const {
      name,
      beginDate,
      endDate,
      discountRate
    } = updateData;
    //Kiểm tra tên sự kiện
    if (name) {
      const existingPromotion = await promotionModel.findOne({
        name,
        _id: {
          $ne: id
        }
      });
      if (existingPromotion) {
        throw customError("Đã có chương trình sự kiện khác có tên này", 400);
      }
    }
    //Kiểm tra tỉ lệ giảm giá
    if (discountRate <= 0 || discountRate > 100) {
      throw customError("Tỉ lệ giảm giá phải lớn hơn 0 và nhỏ hơn 100", 400);
    }
    //Kiểm tra ngày bắt đầu
    const releaseDate = new Date(beginDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (releaseDate < today) {
      throw customError("Ngày bắt đầu phải lớn hơn hoặc bằng ngày hiện tại", 400);
    }
    // Kiểm tra ngày bắt đầu và ngày kết thúc
    const beginDateTemp = new Date(beginDate);
    const endDateTemp = new Date(endDate);
    if (beginDateTemp > endDateTemp) {
      throw customError("Ngày bắt đầu phải nhỏ hơn hoặc bằng ngày kết thúc", 400);
    }

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
      id, {
        paused: true,
      }, {
        new: true,
      }
    );

    if (!promotion) throw customError("Not found promotion", 400);

    return promotion;
  };

  static resumePromotion = async (id) => {
    const promotion = await promotionModel.findByIdAndUpdate(
      id, {
        paused: false,
      }, {
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

  static getPromotionDiscountAmount = async (totalPrice, promotionIDs) => {
    if (promotionIDs.length === 0) return 0;

    let totalDiscountRate = 0;

    await Promise.all(promotionIDs.map(async (id) => {
      const promotion = await promotionModel.findById(id)
      totalDiscountRate += +promotion.discountRate
    }))

    const param = await ParamService.getParams();

    totalDiscountRate = +param.maximumDiscountRate > totalDiscountRate ? totalDiscountRate : param.maximumDiscountRate;

    return totalPrice * (totalDiscountRate / 100)
  }

  static getDetailPromotionByIds = async (promotionIDs) => {

    const data = await Promise.all(promotionIDs.map(async (id) => {
      const promotion = await promotionModel.findById(id)
      if (!promotion) throw customError("Not found promotion")

      return {
        name: promotion.name,
        discountRate: promotion.discountRate
      }
    }))

    return data

  }
}