const Order = require("../models/Order");

// Add Order
const addOrder = async (req, res) => {
    try {
        const { products, totalAmount } = req.body;

        const order = new Order({
            user: req.user.id,
            products,
            totalAmount
        });

        await order.save();

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

module.exports = {
    addOrder
};