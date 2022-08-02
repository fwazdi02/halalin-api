const express = require("express")
const router = express.Router()

const productController = require("../controllers/ProductController")
const configController = require("../controllers/ConfigController")
const paramController = require("../controllers/ParamController")
const productConfigController = require("../controllers/ProductConfigController")
const calculateController = require("../controllers/CalculateController")

/* GET home page. */
router.get("/", function (req, res) {
    res.render("index", { title: "Api-Halalin" })
})

router.use("/product", productController)
router.use("/product-config", productConfigController)
router.use("/meta-param", paramController)
router.use("/meta-config", configController)
router.use("/calculate", calculateController)

module.exports = router
