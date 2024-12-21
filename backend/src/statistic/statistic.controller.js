import expressAsyncHandler from "express-async-handler";
import orderModel from "../order/order.schema.js";

class StatisticController {
    //Tỷ lệ vé đã phục vụ hoặc in theo ngày
    getTicketServeRate = expressAsyncHandler(async (req, res) => {
        const { selectedDate } = req.query;
        if (!selectedDate) {
            res.status(400);
            throw new Error("Vui lòng cung cấp ngày!");
        }
        let matchCondition = { $or: [{ printed: true }, { served: true }] };
        if (selectedDate) {
            const selectedDateObj = new Date(selectedDate);
            const startOfDay = new Date(selectedDateObj.setHours(0, 0, 0, 0));
            const endOfDay = new Date(selectedDateObj.setHours(23, 59, 59, 999));
            const formattedStartDate = startOfDay.toString();
            const formattedEndDate = endOfDay.toString();
            matchCondition.date = { $gte: formattedStartDate, $lte: formattedEndDate };
        }
        const totalTickets = await orderModel.aggregate([
            { $unwind: "$tickets" },
            {
                $group: {
                    _id: null,
                    totalQuantity: { $sum: { $toInt: "$tickets.quantity" } },
                },
            },
        ]);
        const servedTickets = await orderModel.aggregate([
            { $match: { ...matchCondition, $or: [{ printed: true }, { served: true }] } },
            { $unwind: "$tickets" },
            {
                $group: {
                    _id: null,
                    totalQuantity: { $sum: { $toInt: "$tickets.quantity" } },
                },
            },
        ]);
        res.json({
            totalTickets: totalTickets[0]?.totalQuantity || 0,
            servedTickets: servedTickets[0]?.totalQuantity || 0,
        });
    });

    // Tỷ lệ các thể loại vé đã phục vụ hoặc in theo ngày
    getTicketCategoryRate = expressAsyncHandler(async (req, res) => {
        const { selectedDate } = req.query;
        if (!selectedDate) {
            res.status(400);
            throw new Error("Vui lòng cung cấp ngày!");
        }
        let matchCondition = { $or: [{ printed: true }, { served: true }] };
        if (selectedDate) {
            const selectedDateObj = new Date(selectedDate);
            const startOfDay = new Date(selectedDateObj.setHours(0, 0, 0, 0));
            const endOfDay = new Date(selectedDateObj.setHours(23, 59, 59, 999));
            const formattedStartDate = startOfDay.toString();
            const formattedEndDate = endOfDay.toString();
            matchCondition.date = { $gte: formattedStartDate, $lte: formattedEndDate };
        }
        const tickets = await orderModel.aggregate([
            { $match: matchCondition },
            { $unwind: "$tickets" },
            {
                $group: {
                    _id: "$tickets.name",
                    totalQuantity: { $sum: { $toInt: "$tickets.quantity" } },
                },
            },
            { $project: { name: "$_id", totalQuantity: 1, _id: 0 } },
        ]);

        res.json(tickets);
    });

    // Tỷ lệ các sản phẩm đi kèm trong tất cả các vé đã phục vụ hoặc in theo ngày
    getAdditionalItemsRate = expressAsyncHandler(async (req, res) => {
        const { selectedDate } = req.query;
        if (!selectedDate) {
            res.status(400);
            throw new Error("Vui lòng cung cấp ngày!");
        }
        let matchCondition = { $or: [{ printed: true }, { served: true }] };
        if (selectedDate) {
            const selectedDateObj = new Date(selectedDate);
            const startOfDay = new Date(selectedDateObj.setHours(0, 0, 0, 0));
            const endOfDay = new Date(selectedDateObj.setHours(23, 59, 59, 999));
            const formattedStartDate = startOfDay.toString();
            const formattedEndDate = endOfDay.toString();
            matchCondition.date = { $gte: formattedStartDate, $lte: formattedEndDate };
        }
        const items = await orderModel.aggregate([
            { $match: matchCondition },
            { $unwind: "$items" },
            {
                $group: {
                    _id: "$items.name",
                    totalQuantity: { $sum: { $toInt: "$items.quantity" } },
                },
            },
            { $project: { name: "$_id", totalQuantity: 1, _id: 0 } },
        ]);

        res.json(items);
    });

    // Tỷ lệ vé theo phim đã phục vụ hoặc in theo ngày
    getTicketRateByFilm = expressAsyncHandler(async (req, res) => {
        const { selectedDate } = req.query;
        if (!selectedDate) {
            res.status(400);
            throw new Error("Vui lòng cung cấp ngày!");
        }
        let matchCondition = { $or: [{ printed: true }, { served: true }] };
        if (selectedDate) {
            const selectedDateObj = new Date(selectedDate);
            const startOfDay = new Date(selectedDateObj.setHours(0, 0, 0, 0));
            const endOfDay = new Date(selectedDateObj.setHours(23, 59, 59, 999));
            const formattedStartDate = startOfDay.toString();
            const formattedEndDate = endOfDay.toString();
            matchCondition.date = { $gte: formattedStartDate, $lte: formattedEndDate };
        }
        const tickets = await orderModel.aggregate([
            { $match: matchCondition },
            { $unwind: "$tickets" },
            {
                $group: {
                    _id: "$filmName",
                    totalTickets: { $sum: { $toInt: "$tickets.quantity" } },
                },
            },
            { $project: { filmName: "$_id", totalTickets: 1, _id: 0 } },
        ]);

        res.json(tickets);
    });

    // Tổng doanh số vé, bắp, đồ uống đã phục vụ hoặc in theo từng tháng
    getMonthlyStatistics = expressAsyncHandler(async (req, res) => {
        const { year } = req.query;
        if (!year) {
            res.status(400);
            throw new Error("Vui lòng cung cấp năm!");
        }
        const monthlyStats = await orderModel.aggregate([
            {
                $match: {
                    $or: [
                        { printed: true },
                        { served: true }
                    ]
                }
            },
            {
                $project: {
                    month: { $month: "$createdAt" },
                    year: { $year: "$createdAt" },
                    tickets: "$tickets",
                    items: "$items",
                },
            },
            { $match: { year: parseInt(year) } },
            {
                $group: {
                    _id: "$month",
                    // Tính doanh thu từ vé theo từng loại vé
                    totalTicketRevenue: {
                        $sum: {
                            $sum: {
                                $map: {
                                    input: "$tickets",
                                    as: "t",
                                    in: {
                                        $multiply: [
                                            { $toDouble: "$$t.quantity" }, // Chuyển quantity thành số nguyên
                                            { $toDouble: "$$t.unitPrice" } // Chuyển unitPrice thành số thực
                                        ]
                                    }
                                }
                            }
                        }
                    },
                    // Tính doanh thu từ bỏng ngô (bao gồm các tên như "Bắp rang bơ")
                    totalPopcornRevenue: {
                        $sum: {
                            $sum: {
                                $map: {
                                    input: "$items",
                                    as: "i",
                                    in: {
                                        $cond: [
                                            { $regexMatch: { input: "$$i.name", regex: "Bắp", options: "i" } },
                                            { $multiply: [{ $toDouble: "$$i.quantity" }, { $toDouble: "$$i.unitPrice" }] },
                                            0
                                        ]
                                    }
                                }
                            }
                        }
                    },
                    // Tính doanh thu từ đồ uống (bao gồm các tên như "Nước coca")
                    totalDrinksRevenue: {
                        $sum: {
                            $sum: {
                                $map: {
                                    input: "$items",
                                    as: "i",
                                    in: {
                                        $cond: [
                                            { $regexMatch: { input: "$$i.name", regex: "Nước", options: "i" } },
                                            { $multiply: [{ $toDouble: "$$i.quantity" }, { $toDouble: "$$i.unitPrice" }] },
                                            0
                                        ]
                                    }
                                }
                            }
                        }
                    },
                },
            },
            {
                $project: {
                    month: "$_id",
                    totalTicketRevenue: 1,
                    totalPopcornRevenue: 1,
                    totalDrinksRevenue: 1,
                    _id: 0,
                },
            },
            { $sort: { month: 1 } },
        ]);
        res.json(monthlyStats);
    });

    // Tổng doanh thu ngày tính dựa vào tổng tiền (totalMoney) cho tất cả các đơn hàng đã phục vụ hoặc in
    // Doanh thu từ vé theo ngày và số lượng sản phẩm khác "bắp" và "nước" theo ngày
    getDailyStatistics = expressAsyncHandler(async (req, res) => {
        const { selectedDate } = req.query;
        if (!selectedDate) {
            res.status(400);
            throw new Error("Vui lòng cung cấp ngày!");
        }
        const selectedDateObj = new Date(selectedDate);
        const startOfDay = new Date(selectedDateObj.setHours(0, 0, 0, 0));
        const endOfDay = new Date(selectedDateObj.setHours(23, 59, 59, 999));
        const formattedStartDate = startOfDay.toString();
        const formattedEndDate = endOfDay.toString();
        // Tính tổng doanh thu (totalMoney), doanh thu từ vé, và sản phẩm khác "bắp" và "nước"
        const dailyStats = await orderModel.aggregate([
            {
                $match: {
                    $or: [{ printed: true }, { served: true }],
                    date: { $gte: formattedStartDate, $lte: formattedEndDate },
                },
            },
            {
                $project: {
                    totalMoney: 1,
                    tickets: 1,
                    items: 1,
                },
            },
            {
                $group: {
                    _id: null,
                    totalRevenue: { $sum: "$totalMoney" },  // Tổng doanh thu từ tất cả các đơn hàng
                    totalTicketRevenue: {
                        $sum: {
                            $sum: {
                                $map: {
                                    input: "$tickets",
                                    as: "t",
                                    in: {
                                        $multiply: [
                                            { $toDouble: "$$t.quantity" }, // quantity của vé
                                            { $toDouble: "$$t.unitPrice" }, // đơn giá vé
                                        ],
                                    },
                                },
                            },
                        },
                    },
                    totalOtherItemsRevenue: {
                        $sum: {
                            $sum: {
                                $map: {
                                    input: "$items",
                                    as: "i",
                                    in: {
                                        $cond: [
                                            {
                                                $and: [
                                                    { $not: { $regexMatch: { input: "$$i.name", regex: "Bắp", options: "i" } } },
                                                    { $not: { $regexMatch: { input: "$$i.name", regex: "Nước", options: "i" } } },
                                                ],
                                            },
                                            { $multiply: [{ $toDouble: "$$i.quantity" }, { $toDouble: "$$i.unitPrice" }] },
                                            0,
                                        ],
                                    },
                                },
                            },
                        },
                    },
                    otherItemsQuantity: {
                        $sum: {
                            $sum: {
                                $map: {
                                    input: "$items",
                                    as: "i",
                                    in: {
                                        $cond: [
                                            {
                                                $and: [
                                                    { $not: { $regexMatch: { input: "$$i.name", regex: "Bắp", options: "i" } } },
                                                    { $not: { $regexMatch: { input: "$$i.name", regex: "Nước", options: "i" } } },
                                                ],
                                            },
                                            { $toDouble: "$$i.quantity" },
                                            0,
                                        ],
                                    },
                                },
                            },
                        },
                    },
                },
            },
            {
                $project: {
                    totalRevenue: 1,
                    totalTicketRevenue: 1,
                    totalOtherItemsRevenue: 1,
                    otherItemsQuantity: 1,
                    _id: 0,
                },
            },
        ]);
        res.json({
            totalRevenue: dailyStats[0]?.totalRevenue || 0,
            totalTicketRevenue: dailyStats[0]?.totalTicketRevenue || 0,
            totalOtherItemsRevenue: dailyStats[0]?.totalOtherItemsRevenue || 0,
            otherItemsQuantity: dailyStats[0]?.otherItemsQuantity || 0,
        });
    });
}
export default new StatisticController()