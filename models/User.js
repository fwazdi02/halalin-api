const mongoose = require("mongoose")
const { Schema } = mongoose

const usersSchema = new Schema(
    {
        name: { type: String, min: 3 },
        email: { type: String, unique: true },
        password: { type: String },
        photo: { type: String, defaulr: "/avatar.png" },
        is_active: { type: Boolean, default: true }
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
        timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
    }
)

const User = mongoose.model("User", usersSchema)
module.exports = { User }
