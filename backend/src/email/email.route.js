import express from "express";

import emailController from "./email.controller.js";

const router = express.Router();

router.post("/send-confirm-code", emailController.sendConfirmCode);
router.post("/check-confirm-code", emailController.checkConfirmCode);
router.get("/test-sendmail", emailController.testSendMailWithTemplate);


export default router;