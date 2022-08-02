const mongoose = require("mongoose")
const { Schema } = mongoose

const configsSchema = new Schema(
    {
        name: String,
        param_id: { type: Schema.ObjectId, ref: "Param" },
        mandays: { type: Number, min: 0 },
        index_min: { type: Number, min: 0 },
        index_max: { type: Number, min: 0 },
        price: { type: Number, min: 0 }
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
        timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
    }
)

const Config = mongoose.model("Config", configsSchema)
module.exports = { Config }
