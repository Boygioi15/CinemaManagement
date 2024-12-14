import expressAsyncHandler from "express-async-handler";
import {
    AdditionalItemService
} from "./additionalItem.service.js";


class AdditionalItemController {
    createAdditional = expressAsyncHandler(async (req, res, next) => {
        const response = await AdditionalItemService.createAdditional(req.body);
        return res.status(200).json({
            msg: 'Create additional item successfully!',
            success: true,
            data: response,
        });
    });

    getListAdditonal = expressAsyncHandler(async (req, res, next) => {
        const response = await AdditionalItemService.getListAdditonal();
        return res.status(200).json({
            msg: 'Fetched additional items successfully!',
            success: true,
            data: response,
        });
    });

    deleteAdditional = expressAsyncHandler(async (req, res, next) => {
        const {
            id
        } = req.params;
        const response = await AdditionalItemService.deleteAdditional(id);
        return res.status(200).json({
            msg: 'Item deleted successfully!',
            success: true,
            data: response,
        });
    });

    updateAdditional = expressAsyncHandler(async (req, res, next) => {
        const {
            id
        } = req.params;
        const response = await AdditionalItemService.updateAdditional(id, req.body);
        return res.status(200).json({
            msg: 'Item updated successfully!',
            success: true,
            data: response,
        });
    });
}


export default new AdditionalItemController()