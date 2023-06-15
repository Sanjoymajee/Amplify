const Joi = require('joi');

const username = Joi.string().alphanum().min(3).max(30).required();
const email = Joi.string().email().required();
const password = Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{6,72}$'));
const confirmPassword = Joi.string().valid(Joi.ref('password')).required();

const registerSchema = Joi.object({
    email,
    password,
    confirmPassword,
})

const loginSchema = Joi.object({
    email,
    password
})

module.exports = {registerSchema, loginSchema}