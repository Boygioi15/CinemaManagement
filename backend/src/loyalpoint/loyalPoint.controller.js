import expressAsyncHandler from "express-async-handler";
import LoyalPointService from "./loyalPoint.service.js";

class LoyalPointController {
  getLoyalPoint = expressAsyncHandler(async (req, res) => {
    console.log(req.user._id);
    const response = await LoyalPointService.getLoyalPoint(req.user._id);
    return res.status(200).json({
      msg: "Get loyal points successfully!",
      success: true,
      data: response,
    });
  });

  resetLoyalPoint = expressAsyncHandler(async (req, res) => {
    const { customerId } = req.params;
    const { newPointValue } = req.body;
    const response = await LoyalPointService.resetLoyalPoint(
      customerId,
      newPointValue
    );
    return res.status(200).json({
      msg: "Reset loyal points successfully!",
      success: true,
      data: response,
    });
  });

  addLoyalPoint = expressAsyncHandler(async (req, res) => {
    const { customerId } = req.params;
    const { pointsToAdd } = req.body;
    const response = await LoyalPointService.addLoyalPoint(
      customerId,
      pointsToAdd
    );
    return res.status(200).json({
      msg: "Add loyal points successfully!",
      success: true,
      data: response,
    });
  });
}

export const loyalPointController = new LoyalPointController();
