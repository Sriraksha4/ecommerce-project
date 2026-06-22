const Payment = require("../models/Payment");

const addPayment = async (req, res) => {
    try {

        const { order, amount, paymentMethod } = req.body;

        const payment = new Payment({
            user: req.user.id,
            order,
            amount,
            paymentMethod
        });

        await payment.save();

        res.status(201).json({
            message: "Payment Successful",
            payment
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

const getPayments = async (req, res) => {
    try {

        const payments = await Payment.find()
            .populate("user", "name email")
            .populate("order");

        res.status(200).json(payments);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};


module.exports = {
    addPayment,
    getPayments
};