var express = require("express")
var app = express()
const { Product } = require("../models/Product")
const { ProductValidation, ProductDeleteValidation } = require("../validation/VProduct")

const getValidationError = (details) => {
    let errors = details.map((item) => {
        return item.message.replace(/"/g, "")
    })
    return errors
}

app.get("/", async (req, res) => {
    const products = await Product.find()
    res.json({ error: false, message: "Success", data: products })
})

app.delete("/", async (req, res) => {
    const validate = ProductDeleteValidation.validate(req.body)
    if (validate.error) {
        const errors = getValidationError(validate.error.details)
        res.json({ success: false, message: errors })
        throw validate.error
    }
    const deleted = await Product.findOneAndRemove(req.body.id, (err, doc) => {
        if (err) {
            res.json({ success: false, message: "Failed to delete product" })
        } else {
            res.json({ success: true, message: "Product successfully deleted" })
        }
    })
})

app.post("/", (req, res) => {
    const validate = ProductValidation.validate(req.body)
    if (validate.error) {
        const errors = getValidationError(validate.error.details)
        res.json({ success: false, message: errors })
        throw validate.error
    }
    const { name, code } = req.body
    const product = new Product({ name, code })
    product.save((err, doc) => {
        if (err) {
            console.log(err)
            res.json({ success: false, message: `Failed to create product ${code}` })
        } else {
            res.json({ success: true, message: `Product '${code}' successfully saved` })
        }
    })
})

module.exports = app
