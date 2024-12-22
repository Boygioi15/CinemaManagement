import orderModel from "../order/order.schema.js";
import filmShowModel from "../filmShow/filmShow.schema.js";
import expressAsyncHandler from "express-async-handler";
class DebugImplement {
  resetOrderAll = expressAsyncHandler(async (req, res) => {
    try {
      const result = await orderModel.updateMany(
        {}, // No filter, so it applies to all documents
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
    const { id } = req.params;
    try {
      const order = await orderModel.findByIdAndUpdate(
        id,
        {
          printed: false,
          served: false,
          invalidReason_Printed: "",
          invalidReason_Served: "",
        },
        {
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

  deleteAllFilmShows = expressAsyncHandler(async (req, res) => {
    try {
      const result = await filmShowModel.deleteMany({}); // Xóa tất cả tài liệu trong collection
      return res.status(200).json({
        msg: "Deleted all film shows successfully!",
        success: true,
        data: result // Trả về thông tin về số tài liệu đã xóa
      });
    } catch (error) {
      console.error("Error deleting all film shows:", error);
      return res.status(500).json({
        msg: "Internal server error!",
        success: false
      });
    }
  });
}

export default new DebugImplement();
