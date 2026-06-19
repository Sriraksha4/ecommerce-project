const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");

const { addToCart } = require("../controllers/cartController");

router.post("/", protect, addToCart);

module.exports = router;