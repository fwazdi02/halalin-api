const Joi = require("joi")

const ConfigValidation = Joi.object({
    name: Joi.string().required(),
    param_key: Joi.string().required(),
    mandays: Joi.number().required(),
    index_min: Joi.number().required(),
    index_max: Joi.number().required(),
    price: Joi.number().required()
}).unknown()

const ConfigDeleteValidation = Joi.object({
    id: Joi.string().required()
}).unknown()

module.exports = { ConfigValidation, ConfigDeleteValidation }
