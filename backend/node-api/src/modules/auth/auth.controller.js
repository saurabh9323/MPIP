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
    const { email, password } = req.body;

    const { token, user } = await authService.login({
      email,
      password,
    });

    res.cookie("access_token", token, {
      httpOnly: true,      // 🔐 frontend can't access
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 1000, // 1 hour
      path: "/",
    });

    res.status(200).json({
      success: true,
      message: "Login successful",
      user,
    });
  } catch (err) {
    next(err);
  }
};