const mongoose = require("mongoose")
const { Schema } = mongoose

const paramsSchema = new Schema(
    {
        param_key: { type: String, unique: true },
        description: { type: String, default: "" }
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
        timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
    }
)

const Param = mongoose.model("Param", paramsSchema)
module.exports = { Param }
