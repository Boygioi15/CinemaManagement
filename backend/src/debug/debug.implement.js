import {
  orderModel
} from "../order/order.schema.js";
import expressAsyncHandler from "express-async-handler";
class DebugImplement {
  resetOrderAll = expressAsyncHandler(async (req, res) => {
    try {
      const result = await orderModel.updateMany({}, // No filter, so it applies to all documents
        {
          $set: {
            printed: false,
            served: false,
            invalidReason_Printed: "",
            invalidReason_Served: "",
          },
        }
      );

      return res.status(200).json({
        message: "Orders have been reset successfully.",
        modifiedCount: result.modifiedCount, // Number of documents updated
      });
    } catch (error) {
      return res.status(500).json({
        message: "Failed to reset orders.",
        error: error.message,
      });
    }
  });

  resetOrderID = expressAsyncHandler(async (req, res, err) => {
    const {
      id
    } = req.params;
    try {
      const order = await orderModel.findByIdAndUpdate(
        id, {
          printed: false,
          served: false,
          invalidReason_Printed: "",
          invalidReason_Served: "",
        }, {
          new: true,
        }
      );
      return res.status(200).json({
        message: "Orders have been reset successfully.",
        data: order,
      });
    } catch (error) {
      return res.status(500).json({
        message: "Failed to reset orders.",
        err: error,
      });
    }
  });
}

export default new DebugImplement();