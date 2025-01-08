import express from "express";

import {
  loyalPointController
} from "./loyalPoint.controller.js";

const router = express.Router();

router.get("/:customerId", loyalPointController.getLoyalPoint);

router.put("/:customerId/reset", loyalPointController.resetLoyalPoint);

router.patch("/:customerId/add", loyalPointController.addLoyalPoint);

export default router;