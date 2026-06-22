const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");

const {
    addPayment,
    getPayments
} = require("../controllers/paymentController");

router.post("/", protect, addPayment);
router.get("/", protect, getPayments);

module.exports = router;