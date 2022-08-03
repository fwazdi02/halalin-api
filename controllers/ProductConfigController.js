var express = require("express")
var app = express()
const { ProductConfig } = require("../models/ProductConfig")
const { Product } = require("../models/Product")
const { Config } = require("../models/Config")
const { ProductConfigValidation, ProductConfigDeleteValidation } = require("../validation/VProductConfig")

const getValidationError = (details) => {
    let errors = details.map((item) => {
        return item.message.replace(/"/g, "")
    })
    return errors
}

app.get("/", async (req, res) => {
    const configs = await ProductConfig.find().populate(["product_id", "config_id"])
    res.json({ success: true, message: "Success", data: configs })
})

app.delete("/", async (req, res) => {
    const validate = ProductConfigDeleteValidation.validate(req.body)
    if (validate.error) {
        const errors = getValidationError(validate.error.details)
        res.json({ success: false, message: errors[0] })
        throw validate.error
    }
    const deleted = await ProductConfig.findOneAndRemove(req.body.id, (err, doc) => {
        if (err) {
            res.json({ success: false, message: "Failed to delete config" })
        } else {
            res.json({ success: true, message: "ProductConfig successfully deleted" })
        }
    })
})

app.post("/", async (req, res) => {
    const validate = ProductConfigValidation.validate(req.body)
    if (validate.error) {
        const errors = getValidationError(validate.error.details)
        res.json({ success: false, message: errors[0] })
        throw validate.error
    }
    const { product_id, config_id } = req.body
    const product = await Product.findOne({ code: product_id })
    if (!product) {
        res.json({ success: false, message: "Product doesn't exist" })
    }

    const config = await Config.findById(config_id)
    if (!config) {
        res.json({ success: false, message: "Config doesn't exist" })
    }

    const product_config = await new ProductConfig({ product_id: product._id, config_id: config._id })
    product_config.save((err, doc) => {
        if (err) {
            res.json({ success: false, message: "Failed to create ProductConfig" })
        } else {
            res.json({ success: true, message: "ProductConfig successfully saved" })
        }
    })
})

module.exports = app
