const db = require("../../database/mysql");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const AppError = require("../../utils/AppError");

exports.register = async ({ email, password }) => {
  const client = await db.connect();
  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    await client.query("BEGIN");

    const result = await client.query(
      "CALL register_user($1, $2, $3, NULL)",
      [email, hashedPassword, "user"]
    );

    // Postgres returns OUT params in rows
    const message = result.rows[0]?.message;

    if (message !== "SUCCESS") {
      throw new AppError(message, 400);
    }

    await client.query("COMMIT");

    return { message: "User registered successfully" };
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
};


exports.login = async ({ email, password }) => {
  const client = await db.connect();
  try {
    await client.query("BEGIN");

    const result = await client.query(
      "CALL login_user($1, NULL, NULL, NULL, NULL, NULL)",
      [email]
    );

    const user = result.rows[0];

    if (!user || user.status !== "SUCCESS") {
      throw new AppError("Invalid credentials", 400);
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new AppError("Invalid credentials", 400);
    }

    const token = jwt.sign(
      {
        userId: user.user_id,
        role: user.role_name,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    await client.query("COMMIT");

    return {
      token,
      user: {
        id: user.user_id,
        email: user.email,
        role: user.role_name,
      },
    };
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
};

