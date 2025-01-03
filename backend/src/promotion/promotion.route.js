import express from "express";
import promotionController from "./promotion.controller.js";

const router = express.Router();

router.post("/", promotionController.createPromotion);

router.get("/", promotionController.getPromotionByDate);

router.get("/:id", promotionController.getPromotionById);

router.patch("/:id", promotionController.updatePromotion);

router.delete("/:id", promotionController.deletePromotion);

export default router;