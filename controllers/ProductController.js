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
    const is_umkm = req.query.umkm
    let products = []
    if (is_umkm == "true") {
        products = await Product.find({ is_umkm: true })
    } else if (is_umkm == "false") {
        products = await Product.find({ is_umkm: false })
    } else {
        products = await Product.find()
    }
    res.json({ success: true, message: "Success", data: products })
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
    const { name, code, is_umkm } = req.body
    const product = new Product({ name, code, is_umkm })
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
