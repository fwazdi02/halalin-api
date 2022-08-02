const Joi = require("joi")

const ParamValidation = Joi.object({
    param_key: Joi.string().required()
})

const ParamDeleteValidation = Joi.object({
    id: Joi.string().required()
})

module.exports = { ParamValidation, ParamDeleteValidation }
