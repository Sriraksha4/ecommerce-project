const Cart = require("../models/Cart");
const addToCart = async (req, res) => {
    try {
const { product, quantity } = req.body;

    const cart = new Cart({
    user: req.user.id,
    product,
    quantity
});

        await cart.save();

        res.status(201).json({
            message: "Product Added To Cart",
            cart
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

module.exports = {
    addToCart
};