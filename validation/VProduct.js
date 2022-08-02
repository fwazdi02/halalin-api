const Joi = require("joi")

const ProductValidation = Joi.object({
    name: Joi.string().required(),
    code: Joi.string().required()
})

const ProductDeleteValidation = Joi.object({
    id: Joi.string().required()
})

module.exports = { ProductValidation, ProductDeleteValidation }
