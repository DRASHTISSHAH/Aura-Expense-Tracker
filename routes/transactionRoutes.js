const express = require("express");
const router = express.Router();
const transactionController = require("../controllers/transactionController");

// OPTIMIZED Dashboard Route (Combined Summary + Cash Flow)
router.get("/dashboard-data", transactionController.getDashboardData);

// Transaction CRUD Routes
router.get("/", transactionController.getTransactions);
router.get("/combined", transactionController.getCombinedAppData);
router.post("/", transactionController.createTransaction);
router.put("/:id", transactionController.updateTransaction);
router.delete("/:id", transactionController.deleteTransaction);

module.exports = router;
