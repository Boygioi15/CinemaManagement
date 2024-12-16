import expressAsyncHandler from "express-async-handler";
import { ParamService } from "./param.service.js";

class ParamController {
  CreateAgeRestriction = expressAsyncHandler(async (req, res, next) => {
    const response = await ParamService.createAgeRestriction(req.body);
    return res.status(200).json({
      msg: "Create age restriction successfully!",
      success: true,
      data: response,
    });
  });
  UpdateAgeRestriction = expressAsyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const response = await ParamService.updateAgeRestriction(id, req.body);
    return res.status(200).json({
      msg: "Update age restriction successfully!",
      success: true,
      data: response,
    });
  });
  GetAgeRestriction = expressAsyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const response = await ParamService.getAgeRestrictionID(id);
    return res.status(200).json({
      success: true,
      data: response,
    });
  });
  GetAllAgeRestriction = expressAsyncHandler(async (req, res, next) => {
    const response = await ParamService.getAllAgeRestriction();
    return res.status(200).json({
      success: true,
      data: response,
    });
  });
  DeleteAgeRestriction = expressAsyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const response = await ParamService.deleteAgeRestriction(id);
    return res.status(200).json({
      success: true,
      data: response,
    });
  });

  createOrderType = expressAsyncHandler(async (req, res, next) => {
    const response = await ParamService.createOrderType(req.body);
    return res.status(200).json({
      msg: "Create age restriction successfully!",
      success: true,
      data: response,
    });
  });
  UpdateTicketType = expressAsyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const response = await ParamService.updateTicketType(id, req.body);
    return res.status(200).json({
      msg: "Update age restriction successfully!",
      success: true,
      data: response,
    });
  });
  GetAllTicketTypes = expressAsyncHandler(async (req, res, next) => {
    const response = await ParamService.getTicketType();
    return res.status(200).json({
      success: true,
      data: response,
    });
  });
  DeleteTicketType = expressAsyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const response = await ParamService.deleteTicketType(id);
    return res.status(200).json({
      success: true,
      data: response,
    });
  });
}

export default new ParamController();
