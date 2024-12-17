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
  GetAllAgeRestrictionSymbol = expressAsyncHandler(async (req, res, next) => {
    const response = await ParamService.getAllAgeRestriction();
    const symbols = response.map((item) => item.name);

    return res.status(200).json({
      success: true,
      data: symbols, // Send only the list of symbols
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

  createTicketType = expressAsyncHandler(async (req, res, next) => {
    const response = await ParamService.createTicketType(req.body);
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
