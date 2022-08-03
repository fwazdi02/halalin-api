const Joi = require("joi")

const ProductConfigValidation = Joi.object({
    product_id: Joi.string().required(),
    config_id: Joi.string()
        .pattern(new RegExp(/^[0-9a-fA-F]{24}$/))
        .required()
}).unknown()

const ProductConfigDeleteValidation = Joi.object({
    id: Joi.string().required()
}).unknown()

module.exports = { ProductConfigValidation, ProductConfigDeleteValidation }
