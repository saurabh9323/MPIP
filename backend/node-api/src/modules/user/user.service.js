const db = require("../../database/mysql");
const AppError = require("../../utils/AppError");

exports.getUserProfile = async (userId) => {
  const client = await db.connect();

  try {
    await client.query("BEGIN");

    const result = await client.query(
      "CALL get_user_profile($1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL)",
      [userId]
    );

    const profile = result.rows[0];


    if (!profile || profile.status !== "SUCCESS") {
      throw new AppError("User profile not found", 404);
    }

    await client.query("COMMIT");
    return profile;
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
};

exports.updateUserProfile = async (
  userId,
  { first_name, last_name, address, phone_number, profile_pic }
) => {
  const client = await db.connect();

  try {
    await client.query("BEGIN");

    const result = await client.query(
      "CALL update_user_profile($1, $2, $3, $4, $5, $6, NULL)",
      [
        userId,
        first_name,
        last_name,
        address,
        phone_number,
        profile_pic,
      ]
    );

    const response = result.rows[0];

    if (!response || response.status !== "SUCCESS") {
      throw new AppError("Failed to update user profile", 400);
    }

    await client.query("COMMIT");

    return { message: "Profile updated successfully" };
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
};

