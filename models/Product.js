const mongoose = require("mongoose")
const { Schema } = mongoose

const productSchema = new Schema(
    {
        name: String,
        code: { type: String, unique: true },
        description: { type: String, default: "" },
        image: { type: String, default: "" },
        is_umkm: { type: Boolean, default: false }
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
        timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
    }
)

const Product = mongoose.model("Product", productSchema)
module.exports = { Product }
