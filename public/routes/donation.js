const express = require("express");
const Donation = require("../models/donation"); // Import the Donation model
const { authMiddleware } = require("../middleware/auth"); // Protect routes with authentication

const router = express.Router();

// Create a Donation
router.post("/", authMiddleware, async (req, res) => {
  const { foodType, quantity, expiryDate } = req.body;

  try {
    if (!foodType || !quantity || !expiryDate) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const newDonation = new Donation({
      user: req.user.id, // User ID from the auth middleware
      foodType,
      quantity,
      expiryDate,
    });

    await newDonation.save();
    res.status(201).json({ message: "Donation created successfully", donation: newDonation });
  } catch (err) {
    console.error("Donation Creation Error:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Fetch All Donations
router.get("/", async (req, res) => {
  try {
    const donations = await Donation.find().populate("user", "username email"); // Populate user info
    res.status(200).json(donations);
  } catch (err) {
    console.error("Fetch Donations Error:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Fetch Recent Donations
router.get("/recent", async (req, res) => {
  try {
    const recentDonations = await Donation.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("user", "username");

    res.status(200).json({ donations: recentDonations });
  } catch (err) {
    console.error("Fetch Recent Donations Error:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Delete a Donation (Admin or Owner)
router.delete("/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;

  try {
    const donation = await Donation.findById(id);
    if (!donation) {
      return res.status(404).json({ message: "Donation not found" });
    }

    // Ensure only the owner or an admin can delete
    if (donation.user.toString() !== req.user.id && !req.user.isAdmin) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await donation.remove();
    res.status(200).json({ message: "Donation deleted successfully" });
  } catch (err) {
    console.error("Delete Donation Error:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
