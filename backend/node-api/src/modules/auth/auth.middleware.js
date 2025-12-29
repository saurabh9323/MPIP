const jwt = require("jsonwebtoken");
const AppError = require("../../utils/AppError");

exports.authenticate = (req, res, next) => {
  // ✅ Read token from cookie
  const token = req.cookies.access_token;

  if (!token) {
    throw new AppError("Authentication required", 401);
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach decoded payload
    req.user = {
      userId: decoded.userId,
      role: decoded.role,
    };

    next();
  } catch (err) {
    throw new AppError("Invalid or expired token", 401);
  }
};

exports.authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        error: "Access denied",
      });
    }
    next();
  };
};
