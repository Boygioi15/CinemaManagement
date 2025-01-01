import express from "express";
import additionalItemController from "./additionalItem.controller.js";
import { upload } from "../middlewares/cloudinary_multer.js";

const router = express.Router();

router.post(
  "",
  upload.single("thumbnailFile"),
  additionalItemController.createAditionalItem
);
router.put(
  "/:id",
  upload.single("thumbnailFile"),
  additionalItemController.updateAdditionalItem
);

router.get("", additionalItemController.getListAdditonal);

router.delete("/:id", additionalItemController.deleteAdditional);

export default router;
