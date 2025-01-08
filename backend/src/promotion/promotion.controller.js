import expressAsyncHandler from "express-async-handler";
import promotionModel from "./promotion.schema.js";
import { PromotionService } from "./promotion.service.js";
import { handleUploadCloudinary } from "../ulitilities/cloudinary.js";

class PromotionController {
  // Create a new promotion
  createPromotion = expressAsyncHandler(async (req, res, next) => {
    const b64 = Buffer.from(req.file.buffer).toString("base64");
    let dataURI = "data:" + req.file.mimetype + ";base64," + b64;
    const cldRes = await handleUploadCloudinary(dataURI);

    req.body.thumbnailURL = cldRes.url;
    req.body.public_ID = cldRes.public_id;
    //console.log(cldRes);
    const response = await PromotionService.createPromotion(req.body);
    return res.status(200).json({
      msg: "Create promotion successfully!",
      success: true,
      data: response,
    });
  });
  updatePromotion = expressAsyncHandler(async (req, res, next) => {
    const { id } = req.params;
    if (req.file) {
      const b64 = Buffer.from(req.file.buffer).toString("base64");
      let dataURI = "data:" + req.file.mimetype + ";base64," + b64;
      const cldRes = await handleUploadCloudinary(dataURI);
      req.body.thumbnailURL = cldRes.url;
      req.body.public_ID = cldRes.public_id;
    }

    const response = await PromotionService.updatePromotion(id, req.body);

    return res.status(200).json({
      msg: "Update promotion successfully!",
      success: true,
      data: response,
    });
  });

  pausePromotion = expressAsyncHandler(async (req, res) => {
    const { id } = req.params;

    const promotion = await PromotionService.pausePromotion(id);

    return res.status(200).json({
      msg: "Promotions updated successfully",
      success: true,
      data: promotion,
    });
  });

  resumePromotion = expressAsyncHandler(async (req, res) => {
    const { id } = req.params;

    const promotion = await PromotionService.resumePromotion(id);

    return res.status(200).json({
      msg: "Promotions resumed successfully",
      success: true,
      data: promotion,
    });
  });

  getPromotionById = expressAsyncHandler(async (req, res) => {
    const { id } = req.params;

    const promotion = await PromotionService.getPromotionById(id);

    return res.status(200).json({
      msg: " Get promotions by id successfully",
      success: true,
      data: promotion,
    });
  });

  getAllPromotions = expressAsyncHandler(async (req, res) => {
    const promotion = await PromotionService.getAllPromotions();

    return res.status(200).json({
      msg: " Get promotions successfully",
      success: true,
      data: promotion,
    });
  });

  getActivePromotion = expressAsyncHandler(async (req, res) => {
    const promotion = await PromotionService.getActivePromotion();
    return res.status(200).json({
      msg: " Get promotions successfully",
      success: true,
      data: promotion,
    });
  });
}

export default new PromotionController();
