const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
    addCategory,
    getCategories,
    getCategoryById,
    updateCategory,
    deleteCategory
} = require("../controllers/categoryController");


router.post("/", protect, addCategory);
router.get("/", getCategories);
router.get("/:id", getCategoryById);
router.put("/:id", protect, updateCategory);
router.delete("/:id", protect, deleteCategory);


module.exports = router;