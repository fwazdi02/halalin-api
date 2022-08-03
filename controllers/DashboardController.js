var express = require("express")
var app = express()

const getValidationError = (details) => {
    let errors = details.map((item) => {
        return item.message.replace(/"/g, "")
    })
    return errors
}

app.get("/", async (req, res) => {
    res.render("dashboard", { success: true, message: "Success", username: req.session.user.name })
})

module.exports = app
