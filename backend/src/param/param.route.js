import express from "express";
import ParamController from "./param.controller.js";

const router = express.Router();

// Routes cho age restriction
router.post("/age-restriction", ParamController.CreateAgeRestriction);

//router.get("/age-restriction");
router.get("/age-restriction/:id", ParamController.GetAgeRestriction);

router.patch("/age-restriction", ParamController.UpdateAgeRestriction);
router.delete("/age-restriction", ParamController.DeleteAgeRestriction);

router.post("/ticket-type", ParamController.CreateTicketType);

router.get("/ticket-type", ParamController.GetAllTicketTypes);

router.patch("/ticket-type/:id", ParamController.UpdateTicketType);
router.delete("/ticket-type", ParamController.DeleteTicketType);
export default router;
