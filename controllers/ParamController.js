var express = require("express")
var app = express()
const { Param } = require("../models/Param")
const { ParamValidation, ParamDeleteValidation } = require("../validation/VParam")

const getValidationError = (details) => {
    let errors = details.map((item) => {
        return item.message.replace(/"/g, "")
    })
    return errors
}

app.get("/", async (req, res) => {
    const params = await Param.find()
    res.json({ error: false, message: "Success", data: params })
})

app.delete("/", async (req, res) => {
    const validate = ParamDeleteValidation.validate(req.body)
    if (validate.error) {
        const errors = getValidationError(validate.error.details)
        res.json({ success: false, message: errors })
        throw validate.error
    }
    const deleted = await Param.findOneAndRemove(req.body.id, (err, doc) => {
        if (err) {
            res.json({ success: false, message: "Failed to delete param" })
        } else {
            res.json({ success: true, message: "Param successfully deleted" })
        }
    })
})

app.post("/", (req, res) => {
    const validate = ParamValidation.validate(req.body)
    if (validate.error) {
        const errors = getValidationError(validate.error.details)
        res.json({ success: false, message: errors })
        throw validate.error
    }
    const { param_key, description } = req.body
    const param = new Param({ param_key, description })
    param.save((err, doc) => {
        if (err) {
            res.json({ success: false, message: `Failed to create param ${param_key}` })
        } else {
            res.json({ success: true, message: `Param '${param_key}' successfully saved` })
        }
    })
})

module.exports = app
