const Cart = require("../models/Cart");

// Add To Cart
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

// Get User Cart
const getCart = async (req, res) => {
    try {
        const cartItems = await Cart.find({
            user: req.user.id
        }).populate("product");

        res.status(200).json(cartItems);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

module.exports = {
    addToCart,
    getCart
};