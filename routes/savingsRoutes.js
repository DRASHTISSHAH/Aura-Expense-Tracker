// routes/savingsRoutes.js
const express = require("express");
const router = express.Router();
const savingsController = require("../controllers/savingsController");

router.get("/", savingsController.getSavingsTargets);
router.post("/", savingsController.createSavingsTarget);
router.put("/:id", savingsController.updateSavingsTarget);
router.delete("/:id", savingsController.deleteSavingsTarget);

module.exports = router;
