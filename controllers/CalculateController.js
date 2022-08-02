var express = require("express")
var app = express()
const { Product } = require("../models/Product")
const { Config } = require("../models/Config")
const { ProductValidation, ProductDeleteValidation } = require("../validation/VProduct")
const { CalculateValidation } = require("../validation/VCalculate")
const { resolveConfig } = require("prettier")

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

const calculateValidate = (_validation, _details) => {
    console.log("Params Needed : ", _validation)
    return new Promise((resolve, reject) => {
        let count = 0
        _validation.forEach((item) => {
            console.log(item)
            let _check = _details.filter((itemCheck) => {
                return itemCheck[item]
            })
            if (_check.length <= 0) {
                reject(`${item} required in details`)
            } else {
                count += 1
            }
            if (_validation.size == _details.length) {
                resolve(_check[0])
            }
        })
    })
}

const getParam = (_validation, _details, _product) => {
    let sumArray = []
    return new Promise((resolve, reject) => {
        _details.forEach(async (item) => {
            for (const prop in item) {
                let val = item[prop]
                if (typeof val == "number" && val >= 0) {
                    const _allParams = await Config.find({ product_id: _product._id }).populate("param_id")
                    console.log("prop : ", prop)

                    // validatin-max-input
                    let _paramMax = _allParams.filter((single) => {
                        if (single.param_id.param_key == prop) {
                            return single
                        }
                    })

                    let xParamMax = Math.max(..._paramMax.map((o) => o.index_min))
                    let objParamMax = _paramMax.find((o) => o.index_min === xParamMax)
                    if (val > objParamMax.index_max) {
                        reject(`${prop} maximum value is : ${objParamMax.index_max}`)
                    }
                    // validatin-max-input

                    let _params = _allParams.filter((single) => {
                        if (single.param_id.param_key == prop && val >= single.index_min && val <= single.index_max) {
                            return single
                        }
                    })

                    let xMax = Math.max(..._params.map((o) => o.index_min))
                    let objMax = _params.find((o) => o.index_min === xMax)
                    sumArray.push({
                        name: prop,
                        category: objMax.name,
                        mandays: objMax.mandays,
                        price: objMax.price,
                        total: objMax.price * val
                    })
                    if (sumArray.length == _validation.size) {
                        resolve(sumArray)
                    }
                } else {
                    reject(`${prop} value must be positive number`)
                }
            }
        })
    })
}

app.post("/", async (req, res) => {
    const validate = CalculateValidation.validate(req.body)
    if (validate.error) {
        const errors = getValidationError(validate.error.details)
        res.json({ success: false, message: errors })
        throw validate.error
    }

    const product_code = req.body.product_code
    const details = req.body.details

    const product = await Product.findOne({ code: product_code })
    if (!product) {
        res.json({ success: false, message: "Product doesn't exist" })
    }

    const config = await Config.find({ product_id: product._id }).populate("param_id")
    if (!config) {
        res.json({ success: false, message: "Config doesn't exist" })
    }

    // console.log("------config-----")
    // console.log(config)
    // console.log("------config-----")
    // res.json(200)

    let _set = new Set()
    const validation = config.reduce(function (acc, obj) {
        acc.add(obj.param_id.param_key)
        return acc
    }, _set)

    await calculateValidate(validation, details)
        .then(async () => {
            const _params = await getParam(validation, details, product)
            const data = {
                product_code: product.code,
                product_name: product.name,
                details: _params
            }
            res.json({ success: true, message: "Success Calculate", data })
        })
        .catch((err) => {
            res.json({ success: false, message: err })
        })
})

module.exports = app
