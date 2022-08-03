var express = require("express")
var app = express()
const bcrypt = require("bcrypt")
const { User } = require("../models/User")
const { LoginValidation, UserCreateValidation, UserDeleteValidation } = require("../validation/VUser")

const getValidationError = (details) => {
    let errors = details.map((item) => {
        return item.message.replace(/"/g, "")
    })
    return errors
}

app.get("/", async (req, res) => {
    const users = await User.find()
    res.json({ success: true, message: "Success", data: users })
})

app.delete("/", async (req, res) => {
    const validate = UserDeleteValidation.validate(req.body)
    if (validate.error) {
        const errors = getValidationError(validate.error.details)
        res.json({ success: false, message: errors })
        throw validate.error
    }
    const deleted = await User.findOneAndRemove(req.body.id, (err, doc) => {
        if (err) {
            res.json({ success: false, message: "Failed to delete user" })
        } else {
            res.json({ success: true, message: "User successfully deleted" })
        }
    })
})

app.post("/", async (req, res) => {
    console.log(req.body)

    const validate = UserCreateValidation.validate(req.body)
    if (validate.error) {
        const errors = getValidationError(validate.error.details)
        res.json({ success: false, message: errors })
        throw validate.error
    }
    const { email, password, name, photo } = req.body
    const salt = await bcrypt.genSalt(10)
    const hash_password = await bcrypt.hash(password, salt)
    const user = new User({ email, password: hash_password, name, photo })
    user.save((err, doc) => {
        if (err) {
            res.json({ success: false, message: `Failed to create user ${email}` })
        } else {
            res.json({ success: true, message: `User '${email}' successfully saved` })
        }
    })
})

module.exports = app
