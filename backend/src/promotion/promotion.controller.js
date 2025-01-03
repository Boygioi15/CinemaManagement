import expressAsyncHandler from "express-async-handler";
import promotionModel from "./promotion.schema.js";

class PromotionController {
  // Create a new promotion
  createPromotion = expressAsyncHandler(async (req, res, next) => {
    try {
      const {
        discountRate,
        name,
        beginDate,
        endDate
      } = req.body;

      const promotion = await promotionModel.create({
        discountRate,
        name,
        beginDate,
        endDate,
      });

      return res.status(201).json({
        msg: "Promotion created successfully",
        success: true,
        data: promotion,
      });
    } catch (error) {
      next(error);
    }
  });

  // Get promotions by date
  getPromotionByDate = expressAsyncHandler(async (req, res, next) => {
    try {
      const {
        date
      } = req.query;

      const promotions = await promotionModel.find({
        beginDate: {
          $lte: new Date(date)
        },
        endDate: {
          $gte: new Date(date)
        },
      });

      return res.status(200).json({
        msg: "Promotions retrieved successfully",
        success: true,
        data: promotions,
      });
    } catch (error) {
      next(error);
    }
  });

  // Get a promotion by ID
  getPromotionById = expressAsyncHandler(async (req, res, next) => {
    try {
      const {
        id
      } = req.params;

      const promotion = await promotionModel.findById(id);

      if (!promotion) {
        return res.status(404).json({
          msg: "Promotion not found",
          success: false,
        });
      }

      return res.status(200).json({
        msg: "Promotion retrieved successfully",
        success: true,
        data: promotion,
      });
    } catch (error) {
      next(error);
    }
  });

  // Update a promotion by ID
  updatePromotion = expressAsyncHandler(async (req, res, next) => {
    try {
      const {
        id
      } = req.params;
      const {
        discountRate,
        name,
        beginDate,
        endDate
      } = req.body;

      const updatedPromotion = await promotionModel.findByIdAndUpdate(
        id, {
          discountRate,
          name,
          beginDate,
          endDate
        }, {
          new: true,
          runValidators: true
        }
      );

      if (!updatedPromotion) {
        return res.status(404).json({
          msg: "Promotion not found",
          success: false,
        });
      }

      return res.status(200).json({
        msg: "Promotion updated successfully",
        success: true,
        data: updatedPromotion,
      });
    } catch (error) {
      next(error);
    }
  });

  // Delete a promotion by ID
  deletePromotion = expressAsyncHandler(async (req, res, next) => {
    try {
      const {
        id
      } = req.params;

      const deletedPromotion = await promotionModel.findByIdAndDelete(id);

      if (!deletedPromotion) {
        return res.status(404).json({
          msg: "Promotion not found",
          success: false,
        });
      }

      return res.status(200).json({
        msg: "Promotion deleted successfully",
        success: true,
        data: deletedPromotion,
      });
    } catch (error) {
      next(error);
    }
  });
}

export default new PromotionController();