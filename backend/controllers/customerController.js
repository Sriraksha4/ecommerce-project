const User = require("../models/User");

const getCustomers = async (req, res) => {
    try {
        const customers = await User.find();

        res.status(200).json(customers);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

module.exports = {
    getCustomers
};