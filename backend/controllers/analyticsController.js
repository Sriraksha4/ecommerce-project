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

module.exports = {
    getAnalytics
};