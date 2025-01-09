import express from "express";

import {
  loyalPointController
} from "./loyalPoint.controller.js";
import {
  validateToken
} from "../middlewares/verifyToken.js";

const router = express.Router();

router.get("", validateToken, loyalPointController.getLoyalPoint);

router.put("/:customerId/reset", loyalPointController.resetLoyalPoint);

router.patch("/:customerId/add", loyalPointController.addLoyalPoint);

export default router;