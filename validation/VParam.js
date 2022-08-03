const Joi = require("joi")

const ParamValidation = Joi.object({
    param_key: Joi.string().required()
}).unknown()

const ParamDeleteValidation = Joi.object({
    id: Joi.string().required()
}).unknown()

module.exports = { ParamValidation, ParamDeleteValidation }
