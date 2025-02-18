import express from "express";
import promotionController from "./promotion.controller.js";
import { upload } from "../middlewares/cloudinary_multer.js";
const router = express.Router();

router.post(
  "",
  upload.single("thumbnailFile"),
  promotionController.createPromotion
);
router.put(
  "/:id",
  upload.single("thumbnailFile"),
  promotionController.updatePromotion
);
router.patch("/:id/pause", promotionController.pausePromotion);
router.patch("/:id/resume", promotionController.resumePromotion);
router.get("/", promotionController.getAllPromotions);
router.get("/active", promotionController.getActivePromotion);
router.get("/:id", promotionController.getPromotionById);

export default router;
