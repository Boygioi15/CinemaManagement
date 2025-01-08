import expressAsyncHandler from "express-async-handler";
import promotionModel from "./promotion.schema.js";
import {
  PromotionService
} from "./promotion.service.js";

class PromotionController {
  // Create a new promotion
  createPromotion = expressAsyncHandler(async (req, res, next) => {
    const promotion = await PromotionService.createPromotion(req.body)
    return res.status(200).json({
      msg: "Promotions retrieved successfully",
      success: true,
      data: promotion,
    });
  });

  updatePromotion = expressAsyncHandler(async (req, res) => {
    const {
      id
    } = req.params;

    const updateData = req.body;

    const promotion = await PromotionService.updatePromotion(id, updateData)

    return res.status(200).json({
      msg: "Promotions updated successfully",
      success: true,
      data: promotion,
    });
  });

  pausePromotion = expressAsyncHandler(async (req, res) => {
    const {
      id
    } = req.params;

    const promotion = await PromotionService.pausePromotion(id)

    return res.status(200).json({
      msg: "Promotions updated successfully",
      success: true,
      data: promotion,
    });
  });


  resumePromotion = expressAsyncHandler(async (req, res) => {
    const {
      id
    } = req.params;

    const promotion = await PromotionService.resumePromotion()

    return res.status(200).json({
      msg: "Promotions resumed successfully",
      success: true,
      data: promotion,
    });
  });

  getPromotionById = expressAsyncHandler(async (req, res) => {
    const {
      id
    } = req.params;

    const promotion = await PromotionService.getPromotionById(id)

    return res.status(200).json({
      msg: " Get promotions by id successfully",
      success: true,
      data: promotion,
    });
  });

  getAllPromotions = expressAsyncHandler(async (req, res) => {
    const promotion = await PromotionService.getAllPromotions()

    return res.status(200).json({
      msg: " Get promotions successfully",
      success: true,
      data: promotion,
    });
  });

  getActivePromotion = expressAsyncHandler(async (req, res) => {
    const promotion = await PromotionService.getAllPromotions()
    return res.status(200).json({
      msg: " Get promotions successfully",
      success: true,
      data: promotion,
    });
  });

}

export default new PromotionController();