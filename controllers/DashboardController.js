var express = require("express")
var app = express()
const bcrypt = require("bcrypt")
const { User } = require("../models/User")
const { LoginValidation, UserCreateValidation, UserDeleteValidation } = require("../validation/VUser")

const { Param } = require("../models/Param")
const { ParamValidation, ParamDeleteValidation } = require("../validation/VParam")

const { Config } = require("../models/Config")
const { ConfigValidation, ConfigDeleteValidation } = require("../validation/VConfig")

const { Product } = require("../models/Product")
const { ProductValidation, ProductDeleteValidation } = require("../validation/VProduct")

const { ProductConfig } = require("../models/ProductConfig")
const { ProductConfigValidation, ProductConfigDeleteValidation } = require("../validation/VProductConfig")

const getValidationError = (details) => {
    let errors = details.map((item) => {
        return item.message.replace(/"/g, "")
    })
    return errors
}

app.get("/", (req, res) => {
    console.log(req.session.user)
    const username = req.session.user.name ?? "Admin"
    res.render("dashboard", { username: username })
})

// *************************** USER *******************************
app.get("/user", async (req, res) => {
    const username = req.session.user.name ?? "Admin"
    const data = await User.find()
    res.render("user", { username: username, data })
})

app.get("/user/delete/:id", async (req, res) => {
    const username = req.session.user.name ?? "Admin"
    const id = req.query.id
    const deleted = await User.findOneAndRemove(id, (err, doc) => {
        if (err) {
            res.redirect("/dashboard/user")
        } else {
            res.redirect("/dashboard/user")
        }
    })
})

app.get("/user/create", async (req, res) => {
    const username = req.session.user.name ?? "Admin"
    res.render("user-create", { username: username })
})

app.post("/user/create", async (req, res) => {
    const username = req.session.user.name ?? "Admin"
    const validate = UserCreateValidation.validate(req.body)
    if (validate.error) {
        const errors = getValidationError(validate.error.details)
        res.render("user-create", { message: errors[0], username: username })
        throw validate.error
    }
    const { email, password, name, photo } = req.body
    const salt = await bcrypt.genSalt(10)
    const hash_password = await bcrypt.hash(password, salt)
    const user = new User({ email, password: hash_password, name, photo })
    let message = ""
    user.save((err, doc) => {
        if (err) {
            message = "Failed to create "
            res.render("user-create", { message, username: username })
        } else {
            message = "Successfully saved"
            res.redirect("/dashboard/user")
        }
    })
})
// *************************** USER *******************************

// *************************** PARAM *******************************
app.get("/param", async (req, res) => {
    const username = req.session.user.name ?? "Admin"
    const data = await Param.find()
    res.render("param", { username: username, data })
})

app.get("/param/delete/:id", async (req, res) => {
    const username = req.session.user.name ?? "Admin"
    const id = req.query.id
    const deleted = await Param.findOneAndRemove(id, (err, doc) => {
        if (err) {
            res.redirect("/dashboard/param")
        } else {
            res.redirect("/dashboard/param")
        }
    })
})

app.get("/param/create", async (req, res) => {
    const username = req.session.user.name ?? "Admin"
    res.render("param-create", { username: username })
})

app.post("/param/create", async (req, res) => {
    const username = req.session.user.name ?? "Admin"
    const validate = ParamValidation.validate(req.body)
    if (validate.error) {
        const errors = getValidationError(validate.error.details)
        res.render("param-create", { message: errors[0], username: username })
        throw validate.error
    }
    let message = ""
    const { param_key, description } = req.body
    const param = new Param({ param_key, description })
    param.save((err, doc) => {
        if (err) {
            message = "Failed to create"
            res.render("param-create", { message, username: username })
        } else {
            message = "Successfully saved"
            res.redirect("/dashboard/param")
        }
    })
})
// *************************** PARAM *******************************

// *************************** CONFIG *******************************
app.get("/config", async (req, res) => {
    const username = req.session.user.name ?? "Admin"
    const data = await Config.find().populate("param_id")
    console.log(data)
    res.render("config", { username: username, data })
})

app.get("/config/delete/:id", async (req, res) => {
    const username = req.session.user.name ?? "Admin"
    const id = req.query.id
    const deleted = await Config.findOneAndRemove(id, (err, doc) => {
        if (err) {
            res.redirect("/dashboard/config")
        } else {
            res.redirect("/dashboard/config")
        }
    })
})

app.get("/config/create", async (req, res) => {
    const username = req.session.user.name ?? "Admin"
    const ddl_param = await Param.find()
    console.log(ddl_param)
    res.render("config-create", { username: username, ddl_param })
})

app.post("/config/create", async (req, res) => {
    const username = req.session.user.name ?? "Admin"
    const validate = ConfigValidation.validate(req.body)
    const ddl_param = await Param.find()
    if (validate.error) {
        const errors = getValidationError(validate.error.details)
        res.render("config-create", { username: username, message: errors[0], ddl_param })
        throw validate.error
    }
    const { name, param_key, mandays, index_min, index_max, price } = req.body
    const param = await Param.findOne({ param_key })
    if (!param) {
        res.render("config-create", { username: username, message: `Param ${param_key} doesn't exist`, ddl_param })
    } else {
        const config = await new Config({ name, param_id: param._id, mandays, index_min, index_max, price })
        let message = ""
        config.save((err, doc) => {
            if (err) {
                message = "Failed to create"
                res.render("config-create", { message, username: username, ddl_param })
            } else {
                message = "Successfully saved"
                res.redirect("/dashboard/config")
            }
        })
    }
})
// *************************** CONFIG *******************************

// *************************** PRODUCT *******************************
app.get("/product", async (req, res) => {
    const username = req.session.user.name ?? "Admin"
    const data = await Product.find()
    res.render("product", { username: username, data })
})

app.get("/product/delete/:id", async (req, res) => {
    const username = req.session.user.name ?? "Admin"
    const id = req.query.id
    const deleted = await Product.findOneAndRemove(id, (err, doc) => {
        if (err) {
            res.redirect("/dashboard/product")
        } else {
            res.redirect("/dashboard/product")
        }
    })
})

app.get("/product/create", async (req, res) => {
    const username = req.session.user.name ?? "Admin"
    res.render("product-create", { username: username })
})

app.post("/product/create", async (req, res) => {
    const username = req.session.user.name ?? "Admin"
    const validate = ProductValidation.validate(req.body)
    if (validate.error) {
        const errors = getValidationError(validate.error.details)
        res.render("product-create", { message: errors[0], username: username })
        throw validate.error
    }
    let message = ""
    const { name, code, description } = req.body
    const product = new Product({ name, code, description })
    product.save((err, doc) => {
        if (err) {
            message = "Failed to create"
            res.render("product-create", { message, username: username })
        } else {
            message = "Successfully saved"
            res.redirect("/dashboard/product")
        }
    })
})
// *************************** PRODUCT *******************************

// *************************** PRODUCT-CONFIG *******************************
app.get("/product-config", async (req, res) => {
    const username = req.session.user.name ?? "Admin"
    const data = await ProductConfig.find().populate(["product_id", "config_id"])
    console.log(data)
    res.render("product-config", { username: username, data })
})

app.get("/product-config/delete/:id", async (req, res) => {
    const username = req.session.user.name ?? "Admin"
    const id = req.query.id
    const deleted = await ProductConfig.findOneAndRemove(id, (err, doc) => {
        if (err) {
            res.redirect("/dashboard/product-config")
        } else {
            res.redirect("/dashboard/product-config")
        }
    })
})

app.get("/product-config/create", async (req, res) => {
    const username = req.session.user.name ?? "Admin"
    const ddl_product = await Product.find()
    const ddl_config = await Config.find().populate("param_id")
    res.render("product-config-create", { username: username, ddl_product, ddl_config })
})

app.post("/product-config/create", async (req, res) => {
    const username = req.session.user.name ?? "Admin"
    const ddl_product = await Product.find()
    const ddl_config = await Config.find().populate("param_id")

    const validate = ProductConfigValidation.validate(req.body)
    if (validate.error) {
        const errors = getValidationError(validate.error.details)
        res.render("product-config-create", { message: errors[0], username: username, ddl_product, ddl_config })
        throw validate.error
    }
    const { product_id, config_id } = req.body

    const product = await Product.findOne({ code: product_id })
    if (!product) {
        res.render("product-config-create", {
            message: "Product doesn't exist",
            username: username,
            ddl_product,
            ddl_config
        })
    }

    const config = await Config.findById(config_id)
    if (!config) {
        res.render("product-config-create", {
            message: "Config doesn't exist",
            username: username,
            ddl_product,
            ddl_config
        })
    }

    const product_config = await new ProductConfig({ product_id: product._id, config_id: config._id })
    let message = ""
    product_config.save((err, doc) => {
        if (err) {
            message = "Failed to create"
            res.render("product-config-create", { message, username: username, ddl_product, ddl_config })
        } else {
            message = "Successfully saved"
            res.redirect("/dashboard/product-config")
        }
    })
})
// *************************** PRODUCT-CONFIG *******************************

module.exports = app
