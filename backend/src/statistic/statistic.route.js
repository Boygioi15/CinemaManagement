import express from "express";
import statisticController from "./statistic.controller.js";

const router = express.Router();

router.get("/ticket-serve-rate", statisticController.getTicketServeRate);
router.get("/ticket-category-rate", statisticController.getTicketCategoryRate);
router.get(
  "/additional-items-rate",
  statisticController.getAdditionalItemsRate
);
router.get("/ticket-rate-by-film", statisticController.getTicketRateByFilm);
router.get("/monthly-statistic", statisticController.getMonthlyStatistics);
router.get("/daily-statistic", statisticController.getDailyStatistics);
router.get("/film-statistic", statisticController.getFilmStatisticsByDate);

export default router;
