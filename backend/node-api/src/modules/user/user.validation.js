const Joi = require("joi");
const AppError = require("../../utils/AppError");

// Schema for updating user profile
const updateProfileSchema = Joi.object({
  first_name: Joi.string().trim().min(1).max(100).optional(),
  last_name: Joi.string().trim().min(1).max(100).optional(),
  address: Joi.string().trim().max(500).optional(),
  phone_number: Joi.string().trim().max(15).optional(),
  profile_pic: Joi.string().allow(null, "").optional(),
}).min(1); // ❗ Reject empty body

exports.validateUpdateProfile = (payload) => {
  const { error } = updateProfileSchema.validate(payload, {
    abortEarly: true,
    allowUnknown: false, // ❗ Reject extra fields
  });

  if (error) {
    throw new AppError(error.details[0].message, 400);
  }
};
