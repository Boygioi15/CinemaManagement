import express from "express";
import additionalItemController from "./additionalItem.controller.js";
const router = express.Router();


router.post('', additionalItemController.createAdditional);

router.get('', additionalItemController.getListAdditonal);

router.delete('/:id', additionalItemController.deleteAdditional);

router.put('/:id', additionalItemController.updateAdditional);

export default router;