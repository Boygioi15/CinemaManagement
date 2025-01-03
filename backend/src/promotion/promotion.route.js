import express from "express";
import promotionController from "./promotion.controller.js";

const router = express.Router();

router.post("", promotionController.createPromotion);

router.get("", promotionController.getPromotionByDate);

router.get("", promotionController.getPromotionById);

router.patch("", promotionController.updatePromotion);

router.delete("", promotionController.deletePromotion);

export default router;