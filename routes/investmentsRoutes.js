// routes/investmentsRoutes.js
const express = require("express");
const router = express.Router();
const investmentsController = require("../controllers/investmentsController");

router.get("/", investmentsController.getInvestments);
router.post("/", investmentsController.createInvestment);
router.put("/:id", investmentsController.updateInvestment);
router.delete("/:id", investmentsController.deleteInvestment);

module.exports = router;
