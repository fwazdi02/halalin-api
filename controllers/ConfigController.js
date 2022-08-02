var express = require("express")
var app = express()
const { Config } = require("../models/Config")
const { Param } = require("../models/Param")
const { ConfigValidation, ConfigDeleteValidation } = require("../validation/VConfig")

const getValidationError = (details) => {
    let errors = details.map((item) => {
        return item.message.replace(/"/g, "")
    })
    return errors
}

app.get("/", async (req, res) => {
    const configs = await Config.find().populate("param_id", "param_key")
    res.json({ error: false, message: "Success", data: configs })
})

app.delete("/", async (req, res) => {
    const validate = ConfigDeleteValidation.validate(req.body)
    if (validate.error) {
        const errors = getValidationError(validate.error.details)
        res.json({ success: false, message: errors[0] })
        throw validate.error
    }
    const deleted = await Config.findOneAndRemove(req.body.id, (err, doc) => {
        if (err) {
            res.json({ success: false, message: "Failed to delete config" })
        } else {
            res.json({ success: true, message: "Config successfully deleted" })
        }
    })
})

app.post("/", async (req, res) => {
    const validate = ConfigValidation.validate(req.body)
    if (validate.error) {
        const errors = getValidationError(validate.error.details)
        res.json({ success: false, message: errors[0] })
        throw validate.error
    }
    const { name, param_key, mandays, index_min, index_max, price } = req.body
    const param = await Param.findOne({ param_key })
    if (!param) {
        res.json({ success: false, message: `Param ${param_key} doesn't exist` })
    }
    const config = await new Config({ name, param_id: param._id, mandays, index_min, index_max, price })
    config.save((err, doc) => {
        if (err) {
            res.json({ success: false, message: `Failed to create config ${name}` })
        } else {
            res.json({ success: true, message: `Config '${name}' successfully saved` })
        }
    })
})

module.exports = app
