const Category = require("../models/Category");

// Add Category
const addCategory = async (req, res) => {
    try {
        console.log("BODY:", req.body);

        const category = new Category(req.body);
        await category.save();

        res.status(201).json({
            message: "Category Added Successfully",
            category
        });
    } catch (error) {
        console.log("CATEGORY ERROR:", error);

        res.status(500).json({
            message: error.message
        });
    }
};
// Get All Categories
const getCategories = async (req, res) => {
    try {
        const categories = await Category.find();
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get Category By ID
const getCategoryById = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);

        if (!category) {
            return res.status(404).json({
                message: "Category not found"
            });
        }

        res.status(200).json(category);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update Category
const updateCategory = async (req, res) => {
    try {
        const category = await Category.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        if (!category) {
            return res.status(404).json({
                message: "Category not found"
            });
        }

        res.status(200).json({
            message: "Category Updated Successfully",
            category
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete Category
const deleteCategory = async (req, res) => {
    try {
        const category = await Category.findByIdAndDelete(req.params.id);

        if (!category) {
            return res.status(404).json({
                message: "Category not found"
            });
        }

        res.status(200).json({
            message: "Category Deleted Successfully"
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    addCategory,
    getCategories,
    getCategoryById,
    updateCategory,
    deleteCategory
};