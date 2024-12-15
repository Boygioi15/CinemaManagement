import {
  customError
} from "../middlewares/errorHandlers.js";
import additionalItemModel from "./additionalItem.schema.js";

export class AdditionalItemService {
  // Tạo mới một additional item
  static createAdditional = async (data) => {
    const {
      name,
      description,
      price,
      thumbnailURL,
      inStorage
    } = data;

    if (!name || !description || !price || !thumbnailURL || !inStorage) {
      throw customError('All rows are required', 400);
    }

    const newItem = new additionalItemModel({
      name,
      description,
      price,
      thumbnailURL,
      inStorage,
      deleted: false,
    });

    const response = await newItem.save();
    return response;
  };

  static getListAdditonal = async () => {
    const items = await additionalItemModel.find({
      deleted: false
    }).lean();

    return items;
  };

  static deleteAdditional = async (id) => {
    const deletedItem = await additionalItemModel.findByIdAndUpdate(id, {
      deleted: true
    }, {
      new: true
    });
    if (!deletedItem) {
      throw customError('Item not found', 400);
    }
    return deletedItem;
  };

  static updateAdditional = async (id, updateData) => {
    const updatedItem = await additionalItemModel.findByIdAndUpdate(id, updateData, {
      new: true
    });
    if (!updatedItem) {
      throw customError('Item not found', 400);
    }
    return updatedItem;
  };


  static getAdditionalItemsInfo = async (items) => {
    try {
      const itemDetails = await Promise.all(items.map(async (item) => {
        const additionalItem = await additionalItemModel.findById(item.id);
        if (!additionalItem) {
          throw new Error(`Item with id ${item.id} not found`);
        }

        return {
          name: additionalItem.name,
          quantity: item.quantity,
          unitPrice: additionalItem.price.toString()
        };
      }));

      return itemDetails;
    } catch (error) {
      throw new Error(error.message);
    }
  };
}