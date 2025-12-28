const db = require("../../database/mysql");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const AppError = require("../../utils/AppError");

exports.register = async ({ email, password, roleName }) => {
  try {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const [rows] = await db.query("CALL RegisterUser(?, ?, ?)", [
      email,
      hashedPassword,
      roleName,
    ]);

    const result = rows[0][0];

    if (result?.error) {
      throw new AppError(result.error, 400);
    }

    return {
      message: "User registered successfully",
    };
  } catch (err) {
    throw err;
  }
};

exports.login = async ({ email, password }) => {
  const [rows] = await db.query("CALL LoginUser(?)", [email]);
  console.log(rows, "ropws");
  const result = rows[0][0];
  console.log(result.status, "result");
  if (!result || result.status !== "SUCCESS") {
    throw new AppError("Invalid credentials", 400);
  }

  const isMatch = await bcrypt.compare(password, result.password);
  console.log(isMatch, "isMatch");
  if (!isMatch) {
    throw new AppError("Invalid credentials", 400);
  }

  const token = jwt.sign(
    {
      userId: result.user_id,
      role: result.role_name,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  return { token };
};
