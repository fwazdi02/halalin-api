const Joi = require("joi")

const LoginValidation = Joi.object({
    email: Joi.string().required(),
    password: Joi.string().required()
}).unknown()

const UserCreateValidation = Joi.object({
    name: Joi.string().required().min(3),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(6)
}).unknown()

const UserDeleteValidation = Joi.object({
    email: Joi.string().required()
}).unknown()

module.exports = { LoginValidation, UserCreateValidation, UserDeleteValidation }
