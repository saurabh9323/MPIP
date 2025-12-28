const authService = require("./auth.service");
const { validateAuthPayload } = require("./auth.validation");

exports.register = async (req, res, next) => {
  try {
    validateAuthPayload(req.body);
    const result = await authService.register(req.body);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    validateAuthPayload(req.body);
    const result = await authService.login(req.body);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
