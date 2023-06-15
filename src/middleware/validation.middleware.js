const Joi = require('joi');

const validate = (schema) => {
    return async (req, res, next) => {
        const validationOptions = {
            abortEarly: false,
            allowUnknown: true,
            stripUnknown: true
        }
        try {
            req.body = await schema.validateAsync(req.body, validationOptions);
            next();
        } catch (err) {
            res.status(400).json({ message: err.message })
        }
    }
}

module.exports = validate;