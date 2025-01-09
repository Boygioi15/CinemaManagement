import expressAsyncHandler from "express-async-handler";
import {
  orderModel
} from "../order/order.schema.js";
import filmShowModel from "../filmShow/filmShow.schema.js";
import roomModel from "../room/room.controller.js";
import filmModel from "../film/film.schema.js";

class StatisticController {
  //Tỷ lệ vé theo ngày
  getTicketServeRate = expressAsyncHandler(async (req, res) => {
    const { selectedDate } = req.query;

    if (!selectedDate) {
      res.status(400);
      throw new Error("Vui lòng cung cấp ngày!");
    }

    const selectedDateObj = new Date(selectedDate);
    const startOfDay = new Date(selectedDateObj.setHours(0, 0, 0, 0));
    const endOfDay = new Date(selectedDateObj.setHours(23, 59, 59, 999));

    try {
      const result = await orderModel.aggregate([
        {
          $match: {
            createdDate: { $gte: startOfDay, $lte: endOfDay },
          },
        },
        {
          $lookup: {
            from: "ordersdata_filmshows",
            localField: "_id",
            foreignField: "orderRef",
            as: "filmShowData",
          },
        },
        {
          $lookup: {
            from: "orders_decorators_offlines",
            localField: "_id",
            foreignField: "orderRef",
            as: "offlineData",
          },
        },
        {
          $lookup: {
            from: "orders_data_items",
            localField: "_id",
            foreignField: "orderRef",
            as: "itemsData",
          },
        },
        {
          $unwind: {
            path: "$filmShowData",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $unwind: {
            path: "$filmShowData.tickets",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $unwind: {
            path: "$offlineData",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $unwind: {
            path: "$itemsData",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $group: {
            _id: "$_id",
            totalTickets: {
              $sum: { $toInt: "$filmShowData.tickets.quantity" },
            },
            servedTickets: {
              $sum: {
                $cond: [
                  {
                    $and: [
                      { $eq: ["$offlineData.invalidReason_Printed", ""] },
                      { $eq: ["$offlineData.invalidReason_Served", ""] },
                    ],
                  },
                  1,
                  0,
                ],
              },
            },
          },
        },
        {
          $group: {
            _id: null,
            totalTickets: { $sum: "$totalTickets" },
            servedTickets: { $sum: "$servedTickets" },
          },
        },
      ]);

      // Prepare response
      res.json({
        totalTickets: result[0]?.totalTickets || 0,
        servedTickets: result[0]?.servedTickets || 0,
      });
    } catch (error) {
      res.status(500);
      throw new Error("Có lỗi xảy ra khi tính toán dữ liệu!");
    }
  });

  // Tỷ lệ các thể loại vé theo ngày
  getTicketCategoryRate = expressAsyncHandler(async (req, res) => {
    const { selectedDate } = req.query;

    if (!selectedDate) {
      res.status(400);
      throw new Error("Vui lòng cung cấp ngày!");
    }

    const selectedDateObj = new Date(selectedDate);
    const startOfDay = new Date(selectedDateObj.setHours(0, 0, 0, 0));
    const endOfDay = new Date(selectedDateObj.setHours(23, 59, 59, 999));

    try {
      const tickets = await orderModel.aggregate([
        {
          // Match orders by createdDate
          $match: {
            createdDate: { $gte: startOfDay, $lte: endOfDay },
          },
        },
        // {
        //   // Lookup offline decorator data
        //   $lookup: {
        //     from: "orders_decorators_offlines",
        //     foreignField: "orderRef",
        //     as: "offlineData",
        //   },
        // },
        {
          // Lookup tickets from Orders_Data_FilmShow
          $lookup: {
            from: "ordersdata_filmshows",
            localField: "_id",
            foreignField: "orderRef",
            as: "filmShowData",
          },
        },
        {
          // Unwind filmShowData to access tickets
          $unwind: {
            path: "$filmShowData",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          // Unwind tickets array
          $unwind: {
            path: "$filmShowData.tickets",
            preserveNullAndEmptyArrays: true,
          },
        },
        // {
        //   // Filter tickets based on invalidReason_Printed and invalidReason_Served
        //   $match: {
        //     $and: [
        //       { "offlineData.invalidReason_Printed": "" },
        //       { "offlineData.invalidReason_Served": "" },
        //     ],
        //   },
        // },
        // {
        //   // Group tickets by name and sum quantities
        //   $group: {
        //     _id: "$filmShowData.tickets.name",
        //     totalQuantity: {
        //       $sum: { $toInt: "$filmShowData.tickets.quantity" },
        //     },
        //   },
        // },
        // {
        //   // Project the final result
        //   $project: {
        //     name: "$_id",
        //     totalQuantity: 1,
        //     _id: 0,
        //   },
        // },
        {
          $group: {
            _id: "$filmShowData.tickets.name",
            totalRevenue: {
              $sum: {
                $multiply: [
                  { $toDouble: "$filmShowData.tickets.quantity" },
                  { $toDouble: "$filmShowData.tickets.price" },
                ],
              },
            },
          },
        },
        {
          $project: {
            name: "$_id",
            totalRevenue: 1,
            _id: 0,
          },
        },
      ]);

      // Respond with ticket categories and quantities
      res.json(tickets);
    } catch (error) {
      res.status(500);
      throw new Error("Có lỗi xảy ra khi xử lý dữ liệu!");
    }
  });

  //Tỷ lệ các sản phẩm đi kèm trong tất cả các vé theo ngày
  getAdditionalItemsRate = expressAsyncHandler(async (req, res) => {
    const { selectedDate } = req.query;
    if (!selectedDate) {
      res.status(400);
      throw new Error("Vui lòng cung cấp ngày!");
    }

    const selectedDateObj = new Date(selectedDate);
    const startOfDay = new Date(selectedDateObj.setHours(0, 0, 0, 0));
    const endOfDay = new Date(selectedDateObj.setHours(23, 59, 59, 999));

    try {
      const itemsRate = await orderModel.aggregate([
        {
          $match: {
            createdDate: { $gte: startOfDay, $lte: endOfDay },
          },
        },
        // {
        //   $lookup: {
        //     from: "orders_decorators_offlines",
        //     localField: "_id",
        //     foreignField: "orderRef",
        //     as: "offlineData",
        //   },
        // },
        {
          $lookup: {
            from: "orders_data_items",
            localField: "_id",
            foreignField: "orderRef",
            as: "itemsData",
          },
        },
        {
          $unwind: {
            path: "$offlineData",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $unwind: {
            path: "$itemsData",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $unwind: {
            path: "$itemsData.items",
            preserveNullAndEmptyArrays: true,
          },
        },
        // {
        //   $match: {
        //     $and: [
        //       { "offlineData.invalidReason_Printed": "" },
        //       { "offlineData.invalidReason_Served": "" },
        //     ],
        //   },
        // },
        // {
        //   $group: {
        //     _id: "$itemsData.items.name",
        //     totalQuantity: {
        //       $sum: { $toInt: "$itemsData.items.quantity" },
        //     },
        //   },
        // },
        // {
        //   $project: {
        //     name: "$_id",
        //     totalQuantity: 1,
        //     _id: 0,
        //   },
        // },
        {
          $group: {
            _id: "$itemsData.items.name",
            totalRevenue: {
              $sum: {
                $multiply: [
                  { $toDouble: "$itemsData.items.quantity" },
                  { $toDouble: "$itemsData.items.price" },
                ],
              },
            },
          },
        },
        {
          $project: {
            name: "$_id",
            totalRevenue: 1,
            _id: 0,
          },
        },
      ]);

      res.json(itemsRate);
    } catch (error) {
      res.status(500);
      throw new Error("Có lỗi xảy ra khi xử lý dữ liệu!");
    }
  });

  // Tỷ lệ vé theo phim đã phục vụ hoặc in theo ngày
  getTicketRateByFilm = expressAsyncHandler(async (req, res) => {
    const { selectedDate } = req.query;

    if (!selectedDate) {
      res.status(400);
      throw new Error("Vui lòng cung cấp ngày!");
    }

    const selectedDateObj = new Date(selectedDate);
    const startOfDay = new Date(selectedDateObj.setHours(0, 0, 0, 0));
    const endOfDay = new Date(selectedDateObj.setHours(23, 59, 59, 999));

    try {
      const tickets = await orderModel.aggregate([
        {
          // Match orders by createdDate
          $match: {
            createdDate: { $gte: startOfDay, $lte: endOfDay },
          },
        },
        // {
        //   // Lookup offline decorator data
        //   $lookup: {
        //     from: "orders_decorators_offlines",
        //     localField: "_id",
        //     foreignField: "orderRef",
        //     as: "offlineData",
        //   },
        // },
        {
          // Lookup film show data
          $lookup: {
            from: "ordersdata_filmshows",
            localField: "_id",
            foreignField: "orderRef",
            as: "filmShowData",
          },
        },
        {
          // Unwind filmShowData to access tickets
          $unwind: {
            path: "$filmShowData",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          // Unwind tickets array
          $unwind: {
            path: "$filmShowData.tickets",
            preserveNullAndEmptyArrays: true,
          },
        },
        // {
        //   // Filter tickets based on invalidReason_Printed and invalidReason_Served
        //   $match: {
        //     $and: [
        //       { "offlineData.invalidReason_Printed": "" },
        //       { "offlineData.invalidReason_Served": "" },
        //     ],
        //   },
        // },
        {
          // Group tickets by film name and sum quantities
          $group: {
            _id: "$filmShowData.filmName",
            totalTickets: {
              $sum: { $toInt: "$filmShowData.tickets.quantity" },
            },
          },
        },
        {
          // Project the final result
          $project: {
            filmName: "$_id",
            totalTickets: 1,
            _id: 0,
          },
        },
      ]);

      // Respond with ticket rates by film
      res.json(tickets);
    } catch (error) {
      res.status(500);
      throw new Error("Có lỗi xảy ra khi xử lý dữ liệu!");
    }
  });

  // Phim hot nhất ngày
  getHotMovieOfDay = expressAsyncHandler(async (req, res) => {
    const { selectedDate } = req.query;

    if (!selectedDate) {
      res.status(400);
      throw new Error("Vui lòng cung cấp ngày!");
    }

    const selectedDateObj = new Date(selectedDate);
    const startOfDay = new Date(selectedDateObj.setHours(0, 0, 0, 0));
    const endOfDay = new Date(selectedDateObj.setHours(23, 59, 59, 999));

    try {
      const result = await orderModel.aggregate([
        {
          // Match orders by createdDate
          $match: {
            createdDate: { $gte: startOfDay, $lte: endOfDay },
          },
        },
        // {
        //   // Lookup offline decorator data
        //   $lookup: {
        //     from: "orders_decorators_offlines", // Collection name
        //     localField: "_id",
        //     foreignField: "orderRef",
        //     as: "offlineData",
        //   },
        // },
        {
          // Lookup film show data
          $lookup: {
            from: "ordersdata_filmshows", // Collection name
            localField: "_id",
            foreignField: "orderRef",
            as: "filmShowData",
          },
        },
        {
          // Unwind filmShowData to access seatNames
          $unwind: {
            path: "$filmShowData",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          // Unwind seatNames array
          $unwind: {
            path: "$filmShowData.seatNames",
            preserveNullAndEmptyArrays: true,
          },
        },
        // {
        //   // Filter based on invalidReason_Printed and invalidReason_Served
        //   $match: {
        //     $and: [
        //       { "offlineData.invalidReason_Printed": "" },
        //       { "offlineData.invalidReason_Served": "" },
        //     ],
        //   },
        // },
        {
          // Group by filmName and count seatNames
          $group: {
            _id: "$filmShowData.filmName",
            totalSeats: { $sum: 1 },
          },
        },
        {
          // Sort by totalSeats in descending order to get the most booked film
          $sort: {
            totalSeats: -1,
          },
        },
        {
          // Limit to the top 1 film
          $limit: 1,
        },
        {
          // Project the final result
          $project: {
            filmName: "$_id",
            totalSeats: 1,
            _id: 0,
          },
        },
      ]);

      // Respond with the most booked film of the day
      res.json(result[0] || { filmName: null, totalSeats: 0 });
    } catch (error) {
      res.status(500);
      throw new Error("Có lỗi xảy ra khi xử lý dữ liệu!");
    }
  });

  // Sản phẩm bán chạy nhất ngày
  getBestSellingProductOfDay = expressAsyncHandler(async (req, res) => {
    const { selectedDate } = req.query;

    if (!selectedDate) {
      res.status(400);
      throw new Error("Vui lòng cung cấp ngày!");
    }

    const selectedDateObj = new Date(selectedDate);
    const startOfDay = new Date(selectedDateObj.setHours(0, 0, 0, 0));
    const endOfDay = new Date(selectedDateObj.setHours(23, 59, 59, 999));

    try {
      const bestSellingProduct = await orderModel.aggregate([
        {
          $match: {
            createdDate: { $gte: startOfDay, $lte: endOfDay },
          },
        },
        // {
        //   // Lookup offline decorator data
        //   $lookup: {
        //     from: "orders_decorators_offlines", // Collection name
        //     localField: "_id",
        //     foreignField: "orderRef",
        //     as: "offlineData",
        //   },
        // },
        {
          // Lookup items data
          $lookup: {
            from: "orders_data_items", // Collection name
            localField: "_id",
            foreignField: "orderRef",
            as: "itemsData",
          },
        },
        {
          $unwind: {
            path: "$itemsData",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $unwind: {
            path: "$itemsData.items",
            preserveNullAndEmptyArrays: true,
          },
        },
        // {
        //   // Filter based on invalidReason_Printed and invalidReason_Served
        //   $match: {
        //     $and: [
        //       { "offlineData.invalidReason_Printed": "" },
        //       { "offlineData.invalidReason_Served": "" },
        //     ],
        //   },
        // },
        {
          $group: {
            _id: "$itemsData.items.name",
            totalQuantity: {
              $sum: { $toInt: "$itemsData.items.quantity" },
            },
          },
        },
        {
          $sort: { totalQuantity: -1 },
        },
        {
          $limit: 1,
        },
        {
          $project: {
            productName: "$_id",
            totalQuantity: 1,
            _id: 0,
          },
        },
      ]);

      res.json(bestSellingProduct.length ? bestSellingProduct[0] : { message: "Không có dữ liệu sản phẩm trong ngày!" });
    } catch (error) {
      res.status(500);
      throw new Error("Có lỗi xảy ra khi tìm sản phẩm bán chạy nhất!");
    }
  });

  // Tổng doanh số vé và sản phẩm theo từng tháng
  // getMonthlyStatistics = expressAsyncHandler(async (req, res) => {
  //   const { year } = req.query;

  //   if (!year) {
  //     res.status(400);
  //     throw new Error("Vui lòng cung cấp năm!");
  //   }

  //   try {
  //     const startOfYear = new Date(`${year}-01-01T00:00:00.000Z`);
  //     const endOfYear = new Date(`${year}-12-31T23:59:59.999Z`);

  //     const orders = await orderModel.aggregate([
  //       {
  //         $match: {
  //           createdDate: { $gte: startOfYear, $lte: endOfYear },
  //         },
  //       },
  //       {
  //         $lookup: {
  //           from: "orders_decorators_offlines",
  //           localField: "_id",
  //           foreignField: "orderRef",
  //           as: "offlineData",
  //         },
  //       },
  //       {
  //         $match: {
  //           $and: [
  //             { "offlineData.invalidReason_Printed": "" },
  //             { "offlineData.invalidReason_Served": "" },
  //           ],
  //         },
  //       },
  //       {
  //         $lookup: {
  //           from: "ordersdata_filmshows",
  //           localField: "_id",
  //           foreignField: "orderRef",
  //           as: "filmShowData",
  //         },
  //       },
  //       {
  //         $lookup: {
  //           from: "orders_data_items",
  //           localField: "_id",
  //           foreignField: "orderRef",
  //           as: "itemsData",
  //         },
  //       },
  //       {
  //         $lookup: {
  //           from: "orders_decorators_promotions",
  //           localField: "_id",
  //           foreignField: "orderRef",
  //           as: "promotionsData",
  //         },
  //       },
  //       {
  //         $lookup: {
  //           from: "orders_decorators_pointusages",
  //           localField: "_id",
  //           foreignField: "orderRef",
  //           as: "pointsData",
  //         },
  //       },
  //       {
  //         $project: {
  //           month: { $month: "$createdDate" },
  //           tickets: { $arrayElemAt: ["$filmShowData.tickets", 0] },
  //           items: { $arrayElemAt: ["$itemsData.items", 0] },
  //           discountRate: {
  //             $ifNull: [{ $arrayElemAt: ["$promotionsData.promotions.discountRate", 0] }, 0],
  //           },
  //           pointUsed: {
  //             $ifNull: [{ $arrayElemAt: ["$pointsData.pointUsed", 0] }, 0],
  //           },
  //           totalQuantity: {
  //             $add: [
  //               { $sum: { $map: { input: { $arrayElemAt: ["$filmShowData.tickets", 0] }, as: "t", in: { $toInt: "$$t.quantity" } } } },
  //               { $sum: { $map: { input: { $arrayElemAt: ["$itemsData.items", 0] }, as: "i", in: { $toInt: "$$i.quantity" } } } },
  //             ],
  //           },
  //         },
  //       },
  //       {
  //         $project: {
  //           month: 1,
  //           ticketRevenue: {
  //             $sum: {
  //               $map: {
  //                 input: "$tickets",
  //                 as: "t",
  //                 in: {
  //                   $subtract: [
  //                     {
  //                       $multiply: [{ $toDouble: "$$t.price" }, { $toDouble: "$$t.quantity" }],
  //                     },
  //                     {
  //                       $add: [
  //                         {
  //                           $multiply: [
  //                             "$discountRate",
  //                             {
  //                               $multiply: [{ $toDouble: "$$t.price" }, { $toDouble: "$$t.quantity" }],
  //                             },
  //                             0.01,
  //                           ],
  //                         },
  //                         {
  //                           $cond: [
  //                             { $gt: ["$totalQuantity", 0] },
  //                             { $divide: ["$pointUsed", "$totalQuantity"] },
  //                             0,
  //                           ],
  //                         },
  //                       ],
  //                     },
  //                   ],
  //                 },
  //               },
  //             },
  //           },
  //           itemsRevenue: {
  //             $sum: {
  //               $map: {
  //                 input: "$items",
  //                 as: "i",
  //                 in: {
  //                   $subtract: [
  //                     {
  //                       $multiply: [{ $toDouble: "$$i.price" }, { $toDouble: "$$i.quantity" }],
  //                     },
  //                     {
  //                       $add: [
  //                         {
  //                           $multiply: [
  //                             "$discountRate",
  //                             {
  //                               $multiply: [{ $toDouble: "$$i.price" }, { $toDouble: "$$i.quantity" }],
  //                             },
  //                             0.01,
  //                           ],
  //                         },
  //                         {
  //                           $cond: [
  //                             { $gt: ["$totalQuantity", 0] },
  //                             { $divide: ["$pointUsed", "$totalQuantity"] },
  //                             0,
  //                           ],
  //                         },
  //                       ],
  //                     },
  //                   ],
  //                 },
  //               },
  //             },
  //           },
  //         },
  //       },
  //       {
  //         $group: {
  //           _id: { month: "$month" },
  //           totalTicketRevenue: { $sum: "$ticketRevenue" },
  //           totalItemsRevenue: { $sum: "$itemsRevenue" },
  //         },
  //       },
  //       {
  //         $project: {
  //           month: "$_id.month",
  //           totalRevenue: { $add: ["$totalTicketRevenue", "$totalItemsRevenue"] },
  //           totalTicketRevenue: 1,
  //           totalItemsRevenue: 1,
  //           _id: 0,
  //         },
  //       },
  //       {
  //         $sort: { month: 1 },
  //       },
  //     ]);

  //     res.status(200).json({
  //       success: true,
  //       data: orders,
  //     });
  //   } catch (error) {
  //     res.status(500);
  //     throw new Error(`Có lỗi xảy ra: ${error.message}`);
  //   }
  // });

  // Doanh thu từ vé và sản phẩm theo ngày
  // getDailyStatistics = expressAsyncHandler(async (req, res) => {
  //   const { selectedDate } = req.query;

  //   if (!selectedDate) {
  //     res.status(400);
  //     throw new Error("Please provide a date!");
  //   }

  //   const selectedDateObj = new Date(selectedDate);
  //   const startOfDay = new Date(selectedDateObj.setHours(0, 0, 0, 0));
  //   const endOfDay = new Date(selectedDateObj.setHours(23, 59, 59, 999));

  //   try {
  //     const orders = await orderModel.aggregate([
  //       {
  //         $match: {
  //           createdDate: { $gte: startOfDay, $lte: endOfDay },
  //         },
  //       },
  //       // Join with decorators offline
  //       {
  //         $lookup: {
  //           from: "orders_decorators_offlines",
  //           localField: "_id",
  //           foreignField: "orderRef",
  //           as: "offlineData",
  //         },
  //       },
  //       {
  //         $match: {
  //           $and: [
  //             { "offlineData.invalidReason_Printed": "" },
  //             { "offlineData.invalidReason_Served": "" },
  //           ],
  //         },
  //       },
  //       // Join with tickets
  //       {
  //         $lookup: {
  //           from: "ordersdata_filmshows",
  //           localField: "_id",
  //           foreignField: "orderRef",
  //           as: "filmShowData",
  //         },
  //       },
  //       // Join with items
  //       {
  //         $lookup: {
  //           from: "orders_data_items",
  //           localField: "_id",
  //           foreignField: "orderRef",
  //           as: "itemsData",
  //         },
  //       },
  //       // Join with promotions
  //       {
  //         $lookup: {
  //           from: "orders_decorators_promotions",
  //           localField: "_id",
  //           foreignField: "orderRef",
  //           as: "promotionsData",
  //         },
  //       },
  //       // Join with points usage
  //       {
  //         $lookup: {
  //           from: "orders_decorators_pointusages",
  //           localField: "_id",
  //           foreignField: "orderRef",
  //           as: "pointsData",
  //         },
  //       },
  //       {
  //         $project: {
  //           tickets: { $arrayElemAt: ["$filmShowData.tickets", 0] },
  //           items: { $arrayElemAt: ["$itemsData.items", 0] },
  //           discountRate: {
  //             $ifNull: [{ $arrayElemAt: ["$promotionsData.promotions.discountRate", 0] }, 0],
  //           },
  //           pointUsed: {
  //             $ifNull: [{ $arrayElemAt: ["$pointsData.pointUsed", 0] }, 0],
  //           },
  //           totalQuantity: {
  //             $add: [
  //               { $sum: { $map: { input: { $arrayElemAt: ["$filmShowData.tickets", 0] }, as: "t", in: { $toInt: "$$t.quantity" } } } },
  //               { $sum: { $map: { input: { $arrayElemAt: ["$itemsData.items", 0] }, as: "i", in: { $toInt: "$$i.quantity" } } } },
  //             ],
  //           },
  //         },
  //       },
  //       {
  //         $project: {
  //           ticketRevenue: {
  //             $sum: {
  //               $map: {
  //                 input: "$tickets",
  //                 as: "t",
  //                 in: {
  //                   $subtract: [
  //                     {
  //                       $multiply: [
  //                         { $toDouble: "$$t.price" },
  //                         { $toDouble: "$$t.quantity" },
  //                       ],
  //                     },
  //                     {
  //                       $add: [
  //                         {
  //                           $multiply: [
  //                             "$discountRate",
  //                             {
  //                               $multiply: [
  //                                 { $toDouble: "$$t.price" },
  //                                 { $toDouble: "$$t.quantity" },
  //                               ],
  //                             },
  //                             0.01,
  //                           ],
  //                         },
  //                         {
  //                           $cond: [
  //                             { $gt: ["$totalQuantity", 0] },
  //                             { $divide: ["$pointUsed", "$totalQuantity"] },
  //                             0,
  //                           ],
  //                         },
  //                       ],
  //                     },
  //                   ],
  //                 },
  //               },
  //             },
  //           },
  //           itemsRevenue: {
  //             $sum: {
  //               $map: {
  //                 input: "$items",
  //                 as: "i",
  //                 in: {
  //                   $subtract: [
  //                     {
  //                       $multiply: [
  //                         { $toDouble: "$$i.price" },
  //                         { $toDouble: "$$i.quantity" },
  //                       ],
  //                     },
  //                     {
  //                       $add: [
  //                         {
  //                           $multiply: [
  //                             "$discountRate",
  //                             {
  //                               $multiply: [
  //                                 { $toDouble: "$$i.price" },
  //                                 { $toDouble: "$$i.quantity" },
  //                               ],
  //                             },
  //                             0.01,
  //                           ],
  //                         },
  //                         {
  //                           $cond: [
  //                             { $gt: ["$totalQuantity", 0] },
  //                             { $divide: ["$pointUsed", "$totalQuantity"] },
  //                             0,
  //                           ],
  //                         },
  //                       ],
  //                     },
  //                   ],
  //                 },
  //               },
  //             },
  //           },
  //         },
  //       },
  //       {
  //         $group: {
  //           _id: null,
  //           totalTicketRevenue: { $sum: "$ticketRevenue" },
  //           totalItemsRevenue: { $sum: "$itemsRevenue" },
  //         },
  //       },
  //       {
  //         $project: {
  //           totalRevenue: { $add: ["$totalTicketRevenue", "$totalItemsRevenue"] },
  //           totalTicketRevenue: 1,
  //           totalItemsRevenue: 1,
  //         },
  //       },
  //     ]);

  //     res.status(200).json(
  //       orders[0] || {
  //         totalRevenue: 0,
  //         totalTicketRevenue: 0,
  //         totalOtherItemsRevenue: 0,
  //       }
  //     );
  //   } catch (error) {
  //     res.status(500);
  //     throw new Error(`Error: ${error.message}`);
  //   }
  // });

  getMonthlyStatistics = expressAsyncHandler(async (req, res) => {
    const { year } = req.query;
  
    if (!year) {
      res.status(400);
      throw new Error("Vui lòng cung cấp năm!");
    }
  
    try {
      const startOfYear = new Date(`${year}-01-01T00:00:00.000Z`);
      const endOfYear = new Date(`${year}-12-31T23:59:59.999Z`);
  
      // Tính doanh thu thuần
      const netRevenueData = await orderModel.aggregate([
        {
          $match: {
            createdDate: { $gte: startOfYear, $lte: endOfYear },
          },
        },
        {
          $project: {
            month: { $month: "$createdDate" },
            totalPrice: { $toDouble: "$totalPrice" },
          },
        },
        {
          $group: {
            _id: { month: "$month" },
            totalNetRevenue: { $sum: "$totalPrice" },
          },
        },
        {
          $project: {
            month: "$_id.month",
            totalNetRevenue: 1,
            _id: 0,
          },
        },
      ]);
  
      // Tính doanh thu thực tế
      const effectiveRevenueData = await orderModel.aggregate([
        {
          $match: {
            createdDate: { $gte: startOfYear, $lte: endOfYear },
          },
        },
        {
          $lookup: {
            from: "orders_decorators_offlines",
            localField: "_id",
            foreignField: "orderRef",
            as: "offlineData",
          },
        },
        {
          $match: {
            $and: [
              { "offlineData.invalidReason_Printed": "" },
              { "offlineData.invalidReason_Served": "" },
            ],
          },
        },
        {
          $project: {
            month: { $month: "$createdDate" },
            totalPrice: 1,
            totalPriceAfterDiscount: 1,
            effectiveRevenue: {
              $cond: [
                { $ifNull: ["$totalPriceAfterDiscount", false] },
                { $toDouble: "$totalPriceAfterDiscount" },
                { $toDouble: "$totalPrice" },
              ],
            },
          },
        },
        {
          $group: {
            _id: { month: "$month" },
            totalEffectiveRevenue: { $sum: "$effectiveRevenue" },
          },
        },
        {
          $project: {
            month: "$_id.month",
            totalEffectiveRevenue: 1,
            _id: 0,
          },
        },
      ]);
  
      // Kết hợp dữ liệu doanh thu thuần và thực tế
      const combinedData = netRevenueData.map((net) => {
        const effective = effectiveRevenueData.find(
          (eff) => eff.month === net.month
        );
        return {
          month: net.month,
          totalNetRevenue: net.totalNetRevenue,
          totalEffectiveRevenue: effective?.totalEffectiveRevenue || 0,
        };
      });
  
      res.status(200).json(combinedData);
    } catch (error) {
      res.status(500);
      throw new Error(`Có lỗi xảy ra: ${error.message}`);
    }
  });  
  
  getDailyStatistics = expressAsyncHandler(async (req, res) => {
    const { selectedDate } = req.query;
  
    if (!selectedDate) {
      res.status(400);
      throw new Error("Vui lòng cung cấp ngày!");
    }
  
    const selectedDateObj = new Date(selectedDate);
    const startOfDay = new Date(selectedDateObj.setHours(0, 0, 0, 0));
    const endOfDay = new Date(selectedDateObj.setHours(23, 59, 59, 999));
  
    try {
      // Tính doanh thu thuần
      const netRevenueData = await orderModel.aggregate([
        {
          $match: {
            createdDate: { $gte: startOfDay, $lte: endOfDay },
          },
        },
        {
          $project: {
            totalPrice: { $toDouble: "$totalPrice" },
          },
        },
        {
          $group: {
            _id: null,
            totalNetRevenue: { $sum: "$totalPrice" },
          },
        },
      ]);
  
      const totalNetRevenue = netRevenueData[0]?.totalNetRevenue || 0;
  
      // Tính doanh thu thực tế
      const effectiveRevenueData = await orderModel.aggregate([
        {
          $match: {
            createdDate: { $gte: startOfDay, $lte: endOfDay },
          },
        },
        {
          $lookup: {
            from: "orders_decorators_offlines",
            localField: "_id",
            foreignField: "orderRef",
            as: "offlineData",
          },
        },
        {
          $match: {
            $and: [
              { "offlineData.invalidReason_Printed": "" },
              { "offlineData.invalidReason_Served": "" },
            ],
          },
        },
        {
          $project: {
            totalPriceAfterDiscount: 1,
            totalPrice: 1,
            effectiveRevenue: {
              $cond: [
                { $ifNull: ["$totalPriceAfterDiscount", false] },
                { $toDouble: "$totalPriceAfterDiscount" },
                { $toDouble: "$totalPrice" },
              ],
            },
          },
        },
        {
          $group: {
            _id: null,
            totalEffectiveRevenue: { $sum: "$effectiveRevenue" },
          },
        },
      ]);
  
      const totalEffectiveRevenue = effectiveRevenueData[0]?.totalEffectiveRevenue || 0;
  
      // Tính doanh thu vé
      const ticketRevenueData = await orderModel.aggregate([
        {
          $match: {
            createdDate: { $gte: startOfDay, $lte: endOfDay },
          },
        },
        {
          $lookup: {
            from: "ordersdata_filmshows",
            localField: "_id",
            foreignField: "orderRef",
            as: "filmShowData",
          },
        },
        {
          $unwind: {
            path: "$filmShowData",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $unwind: {
            path: "$filmShowData.tickets",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $group: {
            _id: null,
            totalTicketRevenue: {
              $sum: {
                $multiply: [
                  { $toDouble: "$filmShowData.tickets.quantity" },
                  { $toDouble: "$filmShowData.tickets.price" },
                ],
              },
            },
          },
        },
      ]);
  
      const totalTicketRevenue = ticketRevenueData[0]?.totalTicketRevenue || 0;
  
      // Tính doanh thu sản phẩm
      const itemsRevenueData = await orderModel.aggregate([
        {
          $match: {
            createdDate: { $gte: startOfDay, $lte: endOfDay },
          },
        },
        {
          $lookup: {
            from: "orders_data_items",
            localField: "_id",
            foreignField: "orderRef",
            as: "itemsData",
          },
        },
        {
          $unwind: {
            path: "$itemsData",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $unwind: {
            path: "$itemsData.items",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $group: {
            _id: null,
            totalItemsRevenue: {
              $sum: {
                $multiply: [
                  { $toDouble: "$itemsData.items.quantity" },
                  { $toDouble: "$itemsData.items.price" },
                ],
              },
            },
          },
        },
      ]);
  
      const totalOtherItemsRevenue = itemsRevenueData[0]?.totalItemsRevenue || 0;
  
      // Kết hợp dữ liệu
      const result = {
        totalNetRevenue,
        totalEffectiveRevenue,
        totalTicketRevenue,
        totalOtherItemsRevenue,
      };
  
      res.status(200).json(result);
    } catch (error) {
      res.status(500);
      throw new Error(`Có lỗi xảy ra: ${error.message}`);
    }
  });        

  getFilmStatisticsByDate = async (req, res) => {
    const {
      selectedDate
    } = req.query;
    if (!selectedDate) {
      res.status(400);
      throw new Error("Vui lòng cung cấp ngày!");
    }
    const selectedDateObj = new Date(selectedDate);
    const startOfDayUTC = new Date(
      Date.UTC(
        selectedDateObj.getUTCFullYear(),
        selectedDateObj.getUTCMonth(),
        selectedDateObj.getUTCDate(),
        0,
        0,
        0
      )
    );
    const endOfDayUTC = new Date(
      Date.UTC(
        selectedDateObj.getUTCFullYear(),
        selectedDateObj.getUTCMonth(),
        selectedDateObj.getUTCDate(),
        23,
        59,
        59,
        999
      )
    );
    const roomsSet = new Set();
    const events = [];
    const filmShows = await filmShowModel
      .find({
        showDate: {
          $gte: startOfDayUTC,
          $lte: endOfDayUTC
        },
      })
      .populate({
        path: "roomId",
        select: "roomName"
      })
      .populate({
        path: "film",
        select: "name filmDuration filmDescription tagsRef",
        populate: {
          path: "tagsRef",
          select: "name"
        },
      })
      .exec();
    filmShows.forEach((show, index) => {
      const {
        roomId,
        film,
        showTime,
        showDate
      } = show;
      if (!roomId || !roomId.roomName) {
        console.warn(`Room not found for show: ${show._id}`);
        return;
      }
      if (!film || !film.filmDuration) {
        console.warn(`Film not found for show: ${show._id}`);
        return;
      }
      roomsSet.add(roomId.roomName);
      const startTimeParts = showTime.split(":");
      let startTime = 0;
      if (startTimeParts.length === 2) {
        const hours = parseFloat(startTimeParts[0]);
        const minutes = parseFloat(startTimeParts[1]) / 60;
        startTime = hours + minutes;
      }
      const categoryNames = film.tagsRef.map((tag) => tag.name);
      events.push({
        id: index + 1,
        room: roomId.roomName,
        film: film.name,
        starttime: startTime,
        duration: film.filmDuration / 60,
        category: categoryNames,
        date: showDate.toISOString().split("T")[0],
        description: film.filmDescription,
      });
    });
    const rooms = Array.from(roomsSet);
    return res.status(200).json({
      rooms,
      events
    });
  };
}
export default new StatisticController();