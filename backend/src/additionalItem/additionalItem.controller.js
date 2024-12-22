import expressAsyncHandler from "express-async-handler";
import { AdditionalItemService } from "./additionalItem.service.js";
import { handleUploadCloudinary } from "../ulitilities/cloudinary.js";
class AdditionalItemController {
  createAditionalItem = expressAsyncHandler(async (req, res, next) => {
    const b64 = Buffer.from(req.file.buffer).toString("base64");
    let dataURI = "data:" + req.file.mimetype + ";base64," + b64;
    const cldRes = await handleUploadCloudinary(dataURI);

    req.body.thumbnailURL = cldRes.url;
    req.body.public_ID = cldRes.public_id;
    const response = await AdditionalItemService.createAdditionalItem(req.body);
    console.log(response);
    return res.status(200).json({
      msg: "Create additional item successfully!",
      success: true,
      data: response,
    });
  });

  updateAdditionalItem = expressAsyncHandler(async (req, res, next) => {
    const { id } = req.params;
    if (req.file) {
      const b64 = Buffer.from(req.file.buffer).toString("base64");
      let dataURI = "data:" + req.file.mimetype + ";base64," + b64;
      const cldRes = await handleUploadCloudinary(dataURI);
      req.body.thumbnailURL = cldRes.url;
      req.body.public_ID = cldRes.public_id;
    }

    const response = await AdditionalItemService.updateAdditionalById(
      id,
      req.body
    );

    return res.status(200).json({
      msg: "Update additional successfully!",
      success: true,
      data: response,
    });
  });

  getListAdditonal = expressAsyncHandler(async (req, res, next) => {
    const response = await AdditionalItemService.getListAdditonal();
    return res.status(200).json({
      msg: "Fetched additional items successfully!",
      success: true,
      data: response,
    });
  });

  deleteAdditional = expressAsyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const response = await AdditionalItemService.deleteAdditional(id);
    return res.status(200).json({
      msg: "Item deleted successfully!",
      success: true,
      data: response,
    });
  });
}

export default new AdditionalItemController();
