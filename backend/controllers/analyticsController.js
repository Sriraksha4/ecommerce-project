const Product = require("../models/Product");
const Order = require("../models/Order");
const User = require("../models/User");
const getAnalytics = async (req, res) => {
    try {

        const totalProducts = await Product.countDocuments();
        const totalOrders = await Order.countDocuments();
        const totalUsers = await User.countDocuments();

        const orders = await Order.find();

        const totalRevenue = orders.reduce(
            (sum, order) => sum + order.totalAmount,
            0
        );

        res.status(200).json({
            totalProducts,
            totalOrders,
            totalUsers,
            totalRevenue
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};


const getDashboardData = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalProducts = await Product.countDocuments();
        const totalOrders = await Order.countDocuments();

        const orders = await Order.find();

        let totalRevenue = 0;

        orders.forEach(order => {
            totalRevenue += order.totalAmount || 0;
        });

        res.status(200).json({
            totalUsers,
            totalProducts,
            totalOrders,
            totalRevenue
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};
const updateStock = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        product.stock = req.body.stock;

        await product.save();

        res.status(200).json(product);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};
const exportOrders = async (req, res) => {
    try {
        const orders = await Order.find()
.populate("user", "name email")
.populate("products", "name");

        res.status(200).json({
    count: orders.length,
    orders: orders
});
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

module.exports = {
    getAnalytics,
    getDashboardData,
    exportOrders
};