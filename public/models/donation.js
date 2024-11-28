const mongoose = require("mongoose");

// Define the schema for the Donation model
const donationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to the User model (who made the donation)
      required: true,
    },
    foodType: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    expiryDate: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true } // Adds createdAt and updatedAt fields automatically
);

// Create the Donation model using the defined schema
const Donation = mongoose.model("Donation", donationSchema);

module.exports = Donation;
