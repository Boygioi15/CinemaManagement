import expressAsyncHandler from "express-async-handler";
import {
  RoomService
} from "./promotion.service.js";

class PromotionController {

  createPromotion = expressAsyncHandler(async (req, res, next) => {

    return res.status(200).json({
      msg: "Create room successfully!",
      success: true,
      data: response,
    });
  });

  getPromotionByDate = expressAsyncHandler(async (req, res, next) => {

    return res.status(200).json({
      msg: "Create room successfully!",
      success: true,
      data: response,
    });
  });

  getPromotionById = expressAsyncHandler(async (req, res, next) => {

    return res.status(200).json({
      msg: "Create room successfully!",
      success: true,
      data: response,
    });
  });

  updatePromotion = expressAsyncHandler(async (req, res, next) => {

    return res.status(200).json({
      msg: "Create room successfully!",
      success: true,
      data: response,
    });
  });

  deletePromotion = expressAsyncHandler(async (req, res, next) => {

    return res.status(200).json({
      msg: "Create room successfully!",
      success: true,
      data: response,
    });
  });

}

export default new PromotionController();