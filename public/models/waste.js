const mongoose = require("mongoose");

// Define the schema for the Waste model
const wasteSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to the User model (who reported the waste)
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
    location: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "resolved", "in-progress"], // Allowed statuses for the report
      default: "pending", // Default status
    },
  },
  { timestamps: true } // Automatically create createdAt and updatedAt fields
);

// Create the Waste model using the defined schema
const Waste = mongoose.model("Waste", wasteSchema);

module.exports = Waste;
