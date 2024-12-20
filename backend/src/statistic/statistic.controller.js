import expressAsyncHandler from "express-async-handler";
import orderModel from "./order.schema.js";

class StatisticController {
    // Tỷ lệ vé đã phục vụ / vé có sẵn không tính vé từ chối phục vụ
    getTicketServeRate = expressAsyncHandler(async (req, res) => {
        const totalTickets = await orderModel.countDocuments({ served: { $ne: false } });
        const servedTickets = await orderModel.countDocuments({ served: true });

        res.json({
            totalTickets,
            servedTickets,
        });
    });

    // Tỷ lệ các thể loại vé đã phục vụ
    getTicketCategoryRate = expressAsyncHandler(async (req, res) => {
        const tickets = await orderModel.aggregate([
            { $match: { served: true } },
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

    // Tỷ lệ các sản phẩm đi kèm trong tất cả các vé đã phục vụ
    getAdditionalItemsRate = expressAsyncHandler(async (req, res) => {
        const items = await orderModel.aggregate([
            { $match: { served: true } },
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

    // Tỷ lệ vé theo phim
    getTicketRateByFilm = expressAsyncHandler(async (req, res) => {
        const tickets = await orderModel.aggregate([
            { $match: { served: true } },
            {
                $group: {
                    _id: "$filmName",
                    totalTickets: { $sum: 1 },
                },
            },
            { $project: { filmName: "$_id", totalTickets: 1, _id: 0 } },
        ]);

        res.json(tickets);
    });

    // Tổng số vé, bắp, đồ uống đã phục vụ theo từng tháng
    getMonthlyStatistics = expressAsyncHandler(async (req, res) => {
        const { year } = req.query;
        if (!year) {
            res.status(400);
            throw new Error("Year is required");
        }

        const monthlyStats = await orderModel.aggregate([
            { $match: { served: true } },
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
                    totalTickets: { $sum: { $sum: { $map: { input: "$tickets", as: "t", in: { $toInt: "$$t.quantity" } } } } },
                    totalPopcorn: { $sum: { $sum: { $map: { input: "$items", as: "i", in: { $cond: [{ $eq: ["$$i.name", "Popcorn"] }, { $toInt: "$$i.quantity" }, 0] } } } } },
                    totalDrinks: { $sum: { $sum: { $map: { input: "$items", as: "i", in: { $cond: [{ $eq: ["$$i.name", "Drink"] }, { $toInt: "$$i.quantity" }, 0] } } } } },
                },
            },
            {
                $project: {
                    month: "$_id",
                    totalTickets: 1,
                    totalPopcorn: 1,
                    totalDrinks: 1,
                    _id: 0,
                },
            },
            { $sort: { month: 1 } },
        ]);

        res.json(monthlyStats);
    });
}
export default new StatisticController()