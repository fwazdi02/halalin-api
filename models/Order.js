const mongoose = require("mongoose")
const { Schema } = mongoose

const orderSchema = new Schema(
    {
        name: String,
        phone: String,
        email: String,
        type: { type: String },
        body: { type: String },
        total: { type: Number, default: 0 },
        payment_status: { type: String, enum: ["Unpaid", "Verification", "Paid"], default: "Unpaid" }
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
        timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
    }
)

const Order = mongoose.model("Order", orderSchema)
module.exports = { Order }
