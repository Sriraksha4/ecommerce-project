const Order = require("../models/Order");

const Product = require("../models/Product");
const addOrder = async (req, res) => {
    try {

        const { products, totalAmount } = req.body;

        const order = new Order({
            user: req.user.id,
            products,
            totalAmount
        });

        await order.save();

        for (const productId of products) {

            const product = await Product.findById(productId);

            if (product) {
                product.stock -= 1;
                await product.save();
            }
        }

        res.status(201).json({
            message: "Order Created Successfully",
            order
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};
const getOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate("user", "name email")
            .populate("products");

        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};
const updateOrderStatus = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({
                message: "Order not found"
            });
        }

        order.status = req.body.status;

        await order.save();

        res.status(200).json({
            message: "Order Status Updated",
            order
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

module.exports = {
    addOrder,
    getOrders,
    updateOrderStatus
};