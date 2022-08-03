const express = require("express")
const router = express.Router()

const userController = require("../controllers/UserController")
const productController = require("../controllers/ProductController")
const configController = require("../controllers/ConfigController")
const paramController = require("../controllers/ParamController")
const productConfigController = require("../controllers/ProductConfigController")
const calculateController = require("../controllers/CalculateController")

router.use("/user", userController)
router.use("/product", productController)
router.use("/product-config", productConfigController)
router.use("/meta-param", paramController)
router.use("/meta-config", configController)
router.use("/calculate", calculateController)

module.exports = router
