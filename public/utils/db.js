const mongoose = require("mongoose");
require("dotenv").config(); // Load environment variables from .env file

// MongoDB connection URL
const dbURI = process.env.MONGODB_URI || "mongodb://localhost:27017/food_waste_management"; // Default to local DB if no URI is provided

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(dbURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected successfully");
  } catch (err) {
    console.error("MongoDB connection error:", err);
    process.exit(1); // Exit the process with failure if connection fails
  }
};

module.exports = connectDB;
