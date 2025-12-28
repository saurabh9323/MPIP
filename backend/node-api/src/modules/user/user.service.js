const db = require("../../database/mysql");
const AppError = require("../../utils/AppError");

exports.getUserProfile = async (userId) => {
  const [rows] = await db.query("CALL GetUserProfile(?)", [userId]);

  const result = rows[0][0];

  if (!result || result.status !== "SUCCESS") {
    throw new AppError("User profile not found", 404);
  }

  return result;
};

exports.updateUserProfile = async (
  userId,
  { first_name, last_name, address, phone_number, profile_pic }
) => {
  const [rows] = await db.query("CALL UpdateUserProfile(?, ?, ?, ?, ?, ?)", [
    userId,
    first_name,
    last_name,
    address,
    phone_number,
    profile_pic,
  ]);

  const result = rows[0][0];

  if (!result || result.status !== "SUCCESS") {
    throw new AppError("Failed to update user profile", 400);
  }

  return { message: "Profile updated successfully" };
};
