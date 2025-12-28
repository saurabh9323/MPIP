const userService = require("./user.service");
const { validateUpdateProfile } = require("./user.validation");

exports.getUserProfile = async (req, res, next) => {
  try {
    const userId = req.user.userId;

    const result = await userService.getUserProfile(userId);

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

exports.updateUserProfile = async (req, res, next) => {
  try {
    validateUpdateProfile(req.body);

    const userId = req.user.userId;

    const result = await userService.updateUserProfile(userId, req.body);

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
