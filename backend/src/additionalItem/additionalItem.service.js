import { customError } from "../middlewares/errorHandlers.js";
import additionalItemModel from "./additionalItem.schema.js";
import { handleDestroyCloudinary } from "../ulitilities/cloudinary.js";
export class AdditionalItemService {
  // Tạo mới một additional item
  static createAdditionalItem = async (data) => {
    const newItem = new additionalItemModel(data);
    const {price} = data;
    if (price <= 0 ) {
      throw customError("Giá của sản phẩm phải là một số nguyên không âm", 400);
    }
    const response = await newItem.save();
    return response;
  };
  static updateAdditionalById = async (additionalItemID, updateData) => {
    const { name, price } = updateData;
    if (!name || !price) {
      throw customError("Vui lòng nhập đủ các trường", 400);
    }
    if (price <= 0 ) {
      throw customError("Giá của sản phẩm phải là một số nguyên không âm", 400);
    }
    const oldAdditional = await additionalItemModel.findByIdAndUpdate(
      additionalItemID,
      updateData
    );
    //destroy old img
    handleDestroyCloudinary(oldAdditional.public_ID);
    console.log(price);
    return await additionalItemModel.findById(additionalItemID);
  };

  static getListAdditonal = async () => {
    const items = await additionalItemModel
      .find({
        deleted: false,
      })
      .lean()
      .sort({ createdAt: -1 });

    return items;
  };

  static deleteAdditional = async (id) => {
    const deletedItem = await additionalItemModel.findByIdAndUpdate(
      id,
      {
        deleted: true,
      },
      {
        new: true,
      }
    );
    if (!deletedItem) {
      throw customError("Item not found", 400);
    }
    return deletedItem;
  };

  static updateAdditional = async (id, updateData) => {
    const updatedItem = await additionalItemModel.findByIdAndUpdate(
      id,
      updateData,
      {
        new: true,
      }
    );
    if (!updatedItem) {
      throw customError("Item not found", 400);
    }
    return updatedItem;
  };

  static getAdditionalItemsInfo = async (items) => {
    try {
      const itemDetails = await Promise.all(
        items.map(async (item) => {
          const additionalItem = await additionalItemModel.findById(item.id);
          if (!additionalItem) {
            throw new Error(`Item with id ${item.id} not found`);
          }

          return {
            name: additionalItem.name,
            quantity: item.quantity,
            unitPrice: additionalItem.price.toString(),
            loyalPointRate: additionalItem.loyalPointRate,
          };
        })
      );

      return itemDetails;
    } catch (error) {
      throw new Error(error.message);
    }
  };
}
