import expressAsyncHandler from "express-async-handler";
import orderModel from "../order/order.schema.js";

class StatisticController {
    // Tỷ lệ vé đã phục vụ hoặc in/tổng vé
    getTicketServeRate = expressAsyncHandler(async (req, res) => {
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
            { $match: { $or: [{ printed: true }, { served: true }] } },
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

    // Tỷ lệ các thể loại vé đã phục vụ hoặc in
    getTicketCategoryRate = expressAsyncHandler(async (req, res) => {
        const tickets = await orderModel.aggregate([
            { $match: { $or: [{ printed: true }, { served: true }] } },
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

    // Tỷ lệ các sản phẩm đi kèm trong tất cả các vé đã phục vụ hoặc in
    getAdditionalItemsRate = expressAsyncHandler(async (req, res) => {
        const items = await orderModel.aggregate([
            { $match: { $or: [{ printed: true }, { served: true }] } },
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
    

    // Tỷ lệ vé theo phim đã phục vụ hoặc in
    getTicketRateByFilm = expressAsyncHandler(async (req, res) => {
        const tickets = await orderModel.aggregate([
            { $match: { $or: [{ printed: true }, { served: true }] } },
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
}
export default new StatisticController()