const express = require("express");
const router = express.Router();

const {
    getDashboardData,
    exportOrders
} = require("../controllers/analyticsController");

router.get("/dashboard", getDashboardData);
router.get("/export-orders", exportOrders);

module.exports = router;