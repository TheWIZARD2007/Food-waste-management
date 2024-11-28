const express = require("express");
const Waste = require("../models/waste"); // Import the Waste model
const { authMiddleware } = require("../middleware/auth"); // Protect routes with authentication

const router = express.Router();

// Report Food Waste
router.post("/", authMiddleware, async (req, res) => {
  const { foodType, quantity, location, description } = req.body;

  try {
    if (!foodType || !quantity || !location || !description) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const newWasteReport = new Waste({
      user: req.user.id, // User ID from the auth middleware
      foodType,
      quantity,
      location,
      description,
    });

    await newWasteReport.save();
    res.status(201).json({ message: "Waste report created successfully", waste: newWasteReport });
  } catch (err) {
    console.error("Waste Report Creation Error:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Fetch All Waste Reports
router.get("/", async (req, res) => {
  try {
    const wasteReports = await Waste.find().populate("user", "username email"); // Populate user info
    res.status(200).json(wasteReports);
  } catch (err) {
    console.error("Fetch Waste Reports Error:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Fetch Recent Waste Reports
router.get("/recent", async (req, res) => {
  try {
    const recentWasteReports = await Waste.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("user", "username");

    res.status(200).json({ wasteReports: recentWasteReports });
  } catch (err) {
    console.error("Fetch Recent Waste Reports Error:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Update Waste Report Status (Admin or Report Owner)
router.put("/:id/status", authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { status } = req.body; // status could be "pending", "resolved", etc.

  try {
    const wasteReport = await Waste.findById(id);
    if (!wasteReport) {
      return res.status(404).json({ message: "Waste report not found" });
    }

    // Ensure only the owner or an admin can update the report
    if (wasteReport.user.toString() !== req.user.id && !req.user.isAdmin) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    // Update the status
    wasteReport.status = status || wasteReport.status;

    await wasteReport.save();
    res.status(200).json({ message: "Waste report status updated", wasteReport });
  } catch (err) {
    console.error("Update Waste Report Error:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Delete Waste Report (Admin or Report Owner)
router.delete("/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;

  try {
    const wasteReport = await Waste.findById(id);
    if (!wasteReport) {
      return res.status(404).json({ message: "Waste report not found" });
    }

    // Ensure only the owner or an admin can delete the report
    if (wasteReport.user.toString() !== req.user.id && !req.user.isAdmin) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await wasteReport.remove();
    res.status(200).json({ message: "Waste report deleted successfully" });
  } catch (err) {
    console.error("Delete Waste Report Error:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
