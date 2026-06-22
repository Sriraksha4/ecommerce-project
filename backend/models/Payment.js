const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
{
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    order: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order"
    },
    amount: Number,
    paymentMethod: String,
    paymentStatus: {
        type: String,
        default: "Paid"
    }
},
{
    timestamps: true
}
);

module.exports = mongoose.model("Payment", paymentSchema);