const mongoose = require("mongoose")
const { Schema } = mongoose

const productConfigSchema = new Schema(
    {
        product_id: { type: Schema.ObjectId, ref: "Product" },
        config_id: { type: Schema.ObjectId, ref: "Config" }
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
        timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
    }
)

const ProductConfig = mongoose.model("ProductConfig", productConfigSchema)
module.exports = { ProductConfig }
