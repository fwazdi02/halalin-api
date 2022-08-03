const Joi = require("joi")

const CalculateValidation = Joi.object({
    product_code: Joi.string().required(),
    details: Joi.array().required()
}).unknown()

module.exports = { CalculateValidation }
