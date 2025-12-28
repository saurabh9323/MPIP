const Joi = require("joi");
const AppError = require("../../utils/AppError");

const schema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

exports.validateAuthPayload = (payload) => {
  const { error } = schema.validate(payload);

  if (error) {
    throw new AppError(error.details[0].message, 400);
  }
};
