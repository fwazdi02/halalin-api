const mongoose = require("mongoose")
const { Schema } = mongoose

const productSchema = new Schema(
    {
        name: String,
        code: { type: String, unique: true },
        description: { type: String, default: "" },
        icon: { type: String, default: "" }
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
        timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
    }
)

const Product = mongoose.model("Product", productSchema)
module.exports = { Product }
