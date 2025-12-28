const express = require("express");
const router = express.Router();

const userController = require("./user.controller");
const { authenticate } = require("../auth/auth.middleware");

// Get logged-in user profile
router.get("/me", authenticate, userController.getUserProfile);

// Update logged-in user profile
router.put("/me", authenticate, userController.updateUserProfile);

module.exports = router;
