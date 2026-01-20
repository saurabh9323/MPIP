const path = require("path");
require("dotenv").config({
  path: path.resolve(__dirname, "../.env"),
});


const app = require("./app");
const db = require("./database/mysql");

const PORT = process.env.PORT || 5000;

(async () => {
  try {
    await db.query("SELECT 1");
    console.log("✅ MySQL connected successfully");

    app.listen(PORT, () => {
      console.log(`🚀 Node API running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ MySQL connection failed:", error.message);
    process.exit(1);
  }
})();
