import expressAsyncHandler from "express-async-handler";
import { TagService } from "./tag.service.js";

class TagController {
  CreateTag = expressAsyncHandler(async (req, res, next) => {
    const response = await TagService.createTag(req.body);
    return res.status(200).json({
      msg: "Create tag successfully!",
      success: true,
      data: response,
    });
  });
  GetAllTag = expressAsyncHandler(async (req, res, next) => {
    const response = await TagService.getAllTag();
    return res.status(200).json({
      msg: "Here is your list of tags",
      success: true,
      data: response,
    });
  });
}

export default new TagController();
