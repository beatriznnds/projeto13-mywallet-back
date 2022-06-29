import Joi from "joi";

const userSchema = Joi.object({
    email: Joi.string()
        .email()
        .required(),
    password: Joi.string()
        .required()
        .regex(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/)//Minimum eight characters, at least one letter, one number and one special character
});

const newUserSchema = Joi.object({
    name: Joi.string()
        .required(),
    email: Joi.string()
        .email()
        .required(),
    password: Joi.string()
        .required()
        .regex(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/)//Minimum eight characters, at least one letter, one number and one special character
});

const entrySchema = Joi.object({
    value: Joi.string()
        .required()
        .regex(/^\$?\d+(,\d{3})*(\.\d*)?$/),
    description: Joi.string()
        .required(),
    type: Joi.string()
        .required()
        .valid('positive', 'negative')

});

export { userSchema, newUserSchema, entrySchema}