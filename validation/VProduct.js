const Joi = require("joi")

const ProductValidation = Joi.object({
    name: Joi.string().required(),
    code: Joi.string().required()
}).unknown()

const ProductDeleteValidation = Joi.object({
    id: Joi.string().required()
}).unknown()

module.exports = { ProductValidation, ProductDeleteValidation }
