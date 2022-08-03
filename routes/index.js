var express = require("express")
var router = express.Router()

const bcrypt = require("bcrypt")
const { User } = require("../models/User")
const { LoginValidation, UserCreateValidation, UserDeleteValidation } = require("../validation/VUser")

const getValidationError = (details) => {
    let errors = details.map((item) => {
        return item.message.replace(/"/g, "")
    })
    return errors
}

router.get("/", function (req, res) {
    res.render("index", { title: "Api-Halalin" })
})

router.post("/logout", function (req, res) {
    req.session = null
    res.redirect("/login")
})

router.get("/login", function (req, res) {
    console.log(req.csrfToken())
    res.render("login", { title: "Api-Halalin", csrfToken: req.csrfToken() })
})

router.post("/login", async function (req, res) {
    // if (req.session.user) {
    //     res.redirect("/dashboard")
    // }
    const validate = LoginValidation.validate(req.body)
    if (validate.error) {
        const errors = getValidationError(validate.error.details)
        res.render("login", { success: false, message: errors[0] })
        throw validate.error
    }
    const { email, password } = req.body
    const user = await User.findOne({ email })
    if (!user) {
        console.log(req.csrfToken())
        res.render("login", { success: false, message: "Email does not exists", csrfToken: req.csrfToken() })
    } else {
        const validPassword = await bcrypt.compare(password, user.password)
        if (!validPassword) {
            console.log(req.csrfToken())
            res.render("login", { success: false, message: "Invalid email / password", csrfToken: req.csrfToken() })
        } else {
            req.session.user = user
            res.redirect("/dashboard")
        }
    }
})

module.exports = router
