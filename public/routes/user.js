const express = require("express");
const User = require("../models/user"); // Import the User model
const { authMiddleware } = require("../middleware/auth"); // Protect routes with authentication

const router = express.Router();

// Get User Profile
router.get("/profile", authMiddleware, async (req, res) => {
  try {
    // Fetch the logged-in user's data using the user ID from the JWT token
    const user = await User.findById(req.user.id).select("-password"); // Exclude password field
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user); // Return the user profile data
  } catch (err) {
    console.error("Fetch User Profile Error:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Update User Profile
router.put("/profile", authMiddleware, async (req, res) => {
  const { username, email } = req.body;

  try {
    // Check if the user exists
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update user details
    user.username = username || user.username;
    user.email = email || user.email;

    // Save the updated user
    await user.save();
    res.status(200).json({ message: "User profile updated successfully", user });
  } catch (err) {
    console.error("Update User Profile Error:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Delete User Account
router.delete("/account", authMiddleware, async (req, res) => {
  try {
    // Find and delete the user
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await user.remove();
    res.status(200).json({ message: "User account deleted successfully" });
  } catch (err) {
    console.error("Delete User Error:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
