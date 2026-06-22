const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");

const {
    addOrder,
    getOrders,
    updateOrderStatus
} = require("../controllers/orderController");

router.post("/", protect, addOrder);
router.get("/", protect, getOrders);
router.put("/:id", protect, updateOrderStatus);

module.exports = router;