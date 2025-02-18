import filmShowModel from "../filmShow/filmShow.schema.js";
import {
  orderModel,
  ordersDataFilmShowModel,
  ordersDecoratorsPointUsageModel,
  ordersDecoratorsPromotionsModel,
  ordersDataItemsModel,
  ordersDecoratorsOfflineModel,
  ordersDataOthersModel,
} from "./order.schema.js";
import { generateRandomVerifyCode } from "../ulitilities/ultilitiesFunction.js";

import filmModel from "../film/film.schema.js";
import roomModel from "../room/room.schema.js";
import { TicketTypeModel } from "../param/param.schema.js";
import additionalItemModel from "../additionalItem/additionalItem.schema.js";
import mongoose from "mongoose";
import { PromotionService } from "../promotion/promotion.service.js";
import LoyalPointService from "../loyalpoint/loyalPoint.service.js";
import { ParamService } from "../param/param.service.js";
export class OrderService {
  // static getAllOrders = async () => {
  //   return await orderModel.find().sort({
  //     createdAt: -1
  //   });
  // };

  static getOrderBy_id = async (_id) => {
    try {
      const ticket = await orderModel
        .findById(_id)
        .populate("items customer_id");
      return ticket || null;
    } catch (error) {
      console.error("Error fetching ticket by _id:", error);
      throw new Error("An error occurred while fetching the order.");
    }
  };

  static createOrder = async ({
    ticketSelections = null,
    additionalItemSelections = null,
    filmShowId = null,
    totalPrice,
    seatSelections = null,
    promotionIDs = null,
    totalPriceAfterDiscount,
    user,
    otherDatas,
    pointUsage,
  }) => {
    let filmShow = {};
    let film = {};
    let roomName = null;
    let nItems = [];
    let nTickets = [];
    let seatNames = [];

    if (filmShowId) {
      filmShow = await filmShowModel.findById(filmShowId).populate("film");
      if (!filmShow) throw new Error("Film Show not found");
      roomName = (await roomModel.findById(filmShow.roomId)).roomName;
      film = await filmModel.findById(filmShow.film);
      seatNames = await seatSelections.map((seat) => seat.seatName);
    }
    console.log("Reach here-9");
    const ageRestriction = film?.ageRestriction || null;
    const dataFilmShow = {
      filmName: filmShow?.film?.name || null,
      showDate: filmShow?.showDate || null,
      showTime: filmShow?.showTime || null,
    };
    console.log("Reach here-8");
    if (additionalItemSelections.length > 0) {
      nItems = await Promise.all(
        additionalItemSelections.map(async (items) => {
          const item = await additionalItemModel.findById(items._id);
          return {
            name: item.name,
            price: item.price,
            quantity: items.quantity,
          };
        })
      );
    }
    console.log("Reach here-7");
    if (ticketSelections) {
      nTickets = await Promise.all(
        ticketSelections.map(async (ticket) => {
          const ticketData = await TicketTypeModel.findById(ticket._id);
          return {
            name: ticketData.title,
            price: ticketData.price,
            quantity: ticket.quantity,
          };
        })
      );
    }
    console.log("Reach here-6");
    let newOrder;
    try {
      newOrder = await orderModel.create({
        totalPrice: totalPrice,
        totalPriceAfterDiscount: totalPriceAfterDiscount || null,
        customerInfo: {
          customerRef: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
        },
      });
    } catch (error) {
      console.log(error);
    }

    newOrder.verifyCode = generateRandomVerifyCode();
    console.log("Reach here-5");
    // create
    if (filmShowId) {
      await OrderHelper.createFilmShowOrder({
        orderRef: newOrder._id,
        ...dataFilmShow,
        ageRestriction,
        roomName,
        seatNames,
        tickets: nTickets,
      });
    }
    console.log("Reach here-4");
    await OrderHelper.createOfflineServiceOrder({
      orderRef: newOrder._id,
    });
    console.log("Reach here-3");
    if (additionalItemSelections.length > 0) {
      await OrderHelper.createItemsOrder({
        orderRef: newOrder._id,
        items: nItems,
      });
    }
    console.log("Reach here-2");
    if (otherDatas) {
      await OrderHelper.createOrdersDataOthers({
        orderRef: newOrder._id,
        items: otherDatas,
      });
    }
    console.log("Reach here-1");
    if (promotionIDs) {
      await OrderHelper.createPromotionDecorator({
        orderRef: newOrder._id,
        promotions: await PromotionService.getDetailPromotionByIds(
          promotionIDs
        ),
      });
    }
    console.log("Reach here0");
    if (pointUsage) {
      const param = await ParamService.getParams();
      await OrderHelper.createPointUsageDecorator({
        orderRef: newOrder._id,
        pointUsed: pointUsage,
        param_PointToMoneyRatio: param.loyalPoint_PointToReducedPriceRatio,
      });
    }
    console.log("Reach here1");
    // clear point
    if (pointUsage) {
      console.log("🚀 ~ OrderService ~ pointUsage:", pointUsage);
      await LoyalPointService.addLoyalPoint(user._id, -pointUsage);
    }
    console.log("Reach here2");
    // earn point
    const param = await ParamService.getParams();
    const loyalPoint_OrderToPointRatio = param.loyalPoint_OrderToPointRatio;
    let accPoint = Math.floor(
      ((totalPriceAfterDiscount || totalPrice) * loyalPoint_OrderToPointRatio) /
        100
    );
    console.log("Point: ", accPoint);
    console.log("User id: ", user._id);
    await LoyalPointService.addLoyalPoint(user._id, accPoint);

    return await newOrder.save();
  };

  static getDetailOrder = async (orderId) => {
    try {
      const orderObjectId = new mongoose.Types.ObjectId(orderId);

      const order = await orderModel.findById(orderObjectId);
      if (!order) {
        throw new Error("Order not found");
      }

      // Get film show data
      const filmShowData = await ordersDataFilmShowModel.findOne({
        orderRef: orderObjectId,
      });

      // Get items data
      const itemsData = await ordersDataItemsModel.findOne({
        orderRef: orderObjectId,
      });

      // Get promotions
      const promotionsData = await ordersDecoratorsPromotionsModel.findOne({
        orderRef: orderObjectId,
      });

      const otherDatas = await ordersDataOthersModel.findOne({
        orderRef: orderObjectId,
      });

      // Get point usage
      const pointUsageData = await ordersDecoratorsPointUsageModel.findOne({
        orderRef: orderObjectId,
      });

      const offlineService = await ordersDecoratorsOfflineModel.findOne({
        orderRef: orderObjectId,
      });
      // Combine all data into a single response object
      const orderDetails = {
        orderId: order._id,
        verifyCode: order.verifyCode,
        createdDate: order.createdDate,
        totalPrice: order.totalPrice,
        totalPriceAfterDiscount: order.totalPriceAfterDiscount,
        customerInfo: {
          customerId: order.customerInfo.customerRef,
          name: order.customerInfo.name,
          email: order.customerInfo.email,
          phone: order.customerInfo.phone,
        },
        offlineService: {
          printed: offlineService.printed,
          served: offlineService.served,
          invalidReason_Printed: offlineService.invalidReason_Printed,
          invalidReason_Served: offlineService.invalidReason_Served,
        },
        // Film show details if exists
        filmShow: filmShowData
          ? {
              filmName: filmShowData.filmName,
              ageRestriction: filmShowData.ageRestriction,
              showDate: filmShowData.showDate,
              showTime: filmShowData.showTime,
              roomName: filmShowData.roomName,
              seatNames: filmShowData.seatNames,
              tickets: filmShowData.tickets,
            }
          : null,
        otherDatas: otherDatas?.items,
        // Items if exists
        items: itemsData?.items || [],

        // Promotions if exists
        promotions: promotionsData?.promotions || [],

        // Point usage if exists
        pointUsage: pointUsageData
          ? {
              pointUsed: pointUsageData.pointUsed,
              pointToMoneyRatio: pointUsageData.param_PointToMoneyRatio,
            }
          : null,

        // Add timestamps
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
      };

      return {
        success: true,
        data: orderDetails,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  };

  // Function to get all orders with details
  static getAllOrders = async (query = {}, userId = null) => {
    try {
      const searchQuery = userId
        ? {
            ...query,
            "customerInfo.customerRef": new mongoose.Types.ObjectId(userId),
          }
        : query;

      const orders = await orderModel.find(searchQuery).sort({ createdAt: -1 });

      const ordersWithDetails = await Promise.all(
        orders.map(async (order) => {
          const orderDetails = await this.getDetailOrder(order._id);
          return orderDetails.data;
        })
      );

      return {
        success: true,
        data: ordersWithDetails,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  };

  static getAllOrdersByUserId = async (userId = null) => {
    try {
      const orders = await orderModel
        .find({
          "customerInfo.customerRef": new mongoose.Types.ObjectId(userId),
        })
        .sort({
          createdAt: 1,
        });

      const ordersWithDetails = await Promise.all(
        orders.map(async (order) => {
          const orderDetails = await this.getDetailOrder(order._id);
          return orderDetails.data;
        })
      );

      return {
        success: true,
        data: ordersWithDetails,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  };
}

export class OrderHelper {
  static async createOfflineServiceOrder(data) {
    try {
      const offlineDecorator = new ordersDecoratorsOfflineModel({
        orderRef: data.orderRef,
        printed: data.printed || false,
        served: data.served || false,
        invalidReason_Printed: data.invalidReason_Printed || "",
        invalidReason_Served: data.invalidReason_Served || "",
      });

      return await offlineDecorator.save();
    } catch (error) {
      console.error(`Error creating Film Show order: ${error.message}`);
      throw new Error("Failed to create Film Show order.");
    }
  }

  static async disapprovePrinted(orderRef, reason) {
    try {
      if (!mongoose.Types.ObjectId.isValid(orderRef)) {
        throw new Error("Invalid order reference");
      }

      const order = await ordersDecoratorsOfflineModel.findOneAndUpdate(
        {
          orderRef,
        },
        {
          printed: false,
          invalidReason_Printed: reason,
        },
        {
          new: true,
        }
      );

      return {
        success: true,
        data: order || null,
      };
    } catch (error) {
      console.error("Error disapproving printed status:", error);
      return {
        success: false,
        error: "An error occurred while disapproving the printed status.",
      };
    }
  }

  static async disapproveServed(orderRef, reason) {
    try {
      if (!mongoose.Types.ObjectId.isValid(orderRef)) {
        throw new Error("Invalid order reference");
      }

      const order = await ordersDecoratorsOfflineModel.findOneAndUpdate(
        {
          orderRef,
        },
        {
          served: false,
          invalidReason_Served: reason,
        },
        {
          new: true,
        }
      );

      return {
        success: true,
        data: order || null,
      };
    } catch (error) {
      console.error("Error disapproving served status:", error);
      return {
        success: false,
        error: "An error occurred while disapproving the served status.",
      };
    }
  }

  static async markOrderPrinted(orderRef) {
    try {
      if (!mongoose.Types.ObjectId.isValid(orderRef)) {
        throw new Error("Invalid order reference");
      }

      const order = await ordersDecoratorsOfflineModel.findOne({
        orderRef,
      });

      if (!order) {
        return {
          success: false,
          error: "Order not found",
        };
      }

      if (order.printed) {
        return {
          success: false,
          error: "Vé đã được in",
        };
      }

      const updatedOrder = await ordersDecoratorsOfflineModel.findOneAndUpdate(
        {
          orderRef,
        },
        {
          printed: true,
          invalidReason_Printed: "", // Clear any previous invalid reason
        },
        {
          new: true,
        }
      );

      return {
        success: true,
        data: updatedOrder,
      };
    } catch (error) {
      console.error("Error marking order as printed:", error);
      return {
        success: false,
        error: "An error occurred while marking the order as printed.",
      };
    }
  }

  static async markOrderServed(orderRef) {
    try {
      if (!mongoose.Types.ObjectId.isValid(orderRef)) {
        throw new Error("Invalid order reference");
      }

      const order = await ordersDecoratorsOfflineModel.findOne({
        orderRef,
      });

      if (!order) {
        return {
          success: false,
          error: "Order not found",
        };
      }

      if (order.served) {
        return {
          success: false,
          error: "Vé đã được phục vụ",
        };
      }

      const updatedOrder = await ordersDecoratorsOfflineModel.findOneAndUpdate(
        {
          orderRef,
        },
        {
          served: true,
          invalidReason_Served: "",
        },
        {
          new: true,
        }
      );

      return {
        success: true,
        data: updatedOrder,
      };
    } catch (error) {
      console.error("Error marking order as served:", error);
      return {
        success: false,
        error: "An error occurred while marking the order as served.",
      };
    }
  }

  static async createFilmShowOrder(data) {
    try {
      const order = new ordersDataFilmShowModel(data);
      return await order.save();
    } catch (error) {
      console.error(`Error creating Film Show order: ${error.message}`);
      throw new Error("Failed to create Film Show order.");
    }
  }

  static async createOrdersDataOthers(data) {
    try {
      const order = new ordersDataOthersModel(data);
      return await order.save();
    } catch (error) {
      console.error(`Error creating Film Show order: ${error.message}`);
      throw new Error("Failed to create Film Show order.");
    }
  }

  static async getFilmShowOrderById(orderRef) {
    try {
      const order = await ordersDataFilmShowModel.findOne({
        orderRef,
      });
      if (!order) throw new Error("Film Show order not found.");
      return order;
    } catch (error) {
      console.error(`Error fetching Film Show order by ID: ${error.message}`);
      throw new Error("Failed to fetch Film Show order.");
    }
  }

  static async createItemsOrder(data) {
    try {
      const order = new ordersDataItemsModel(data);
      return await order.save();
    } catch (error) {
      console.error(`Error creating Items order: ${error.message}`);
      throw new Error("Failed to create Items order.");
    }
  }

  static async getItemsOrderById(orderRef) {
    try {
      const order = await ordersDataItemsModel.findOne({
        orderRef,
      });
      if (!order) throw new Error("Items order not found.");
      return order;
    } catch (error) {
      console.error(`Error fetching Items order by ID: ${error.message}`);
      throw new Error("Failed to fetch Items order.");
    }
  }

  static async createPromotionDecorator(data) {
    try {
      const decorator = new ordersDecoratorsPromotionsModel(data);
      return await decorator.save();
    } catch (error) {
      console.error(`Error creating Promotion Decorator: ${error.message}`);
      throw new Error("Failed to create Promotion Decorator.");
    }
  }

  static async getPromotionDecoratorById(orderRef) {
    try {
      const decorator = await ordersDecoratorsPromotionsModel.findOne({
        orderRef,
      });
      if (!decorator) throw new Error("Promotion Decorator not found.");
      return decorator;
    } catch (error) {
      console.error(
        `Error fetching Promotion Decorator by ID: ${error.message}`
      );
      throw new Error("Failed to fetch Promotion Decorator.");
    }
  }

  static async createPointUsageDecorator(data) {
    try {
      const decorator = new ordersDecoratorsPointUsageModel(data);
      return await decorator.save();
    } catch (error) {
      console.error(`Error creating Point Usage Decorator: ${error.message}`);
      throw new Error("Failed to create Point Usage Decorator.");
    }
  }

  static async getPointUsageDecoratorById(orderRef) {
    try {
      const decorator = await ordersDecoratorsPointUsageModel.findOne({
        orderRef,
      });
      if (!decorator) throw new Error("Point Usage Decorator not found.");
      return decorator;
    } catch (error) {
      console.error(
        `Error fetching Point Usage Decorator by ID: ${error.message}`
      );
      throw new Error("Failed to fetch Point Usage Decorator.");
    }
  }
}
