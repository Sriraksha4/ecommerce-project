const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");

const {
    addProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct,
    updateStock
} = require("../controllers/productController");

router.delete("/:id", protect, deleteProduct);
router.post("/", protect, addProduct);
router.get("/", getProducts);
router.get("/:id", getProductById);
router.put("/:id", protect, updateProduct);

router.put("/update-stock/:id", updateStock);

module.exports = router;
