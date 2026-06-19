const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");

const { addOrder } = require("../controllers/orderController");

router.post("/", protect, addOrder);

module.exports = router;