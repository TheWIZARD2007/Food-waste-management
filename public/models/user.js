
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// Define the schema for the User model
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true, // Ensure the username is unique
    },
    email: {
      type: String,
      required: true,
      unique: true, // Ensure the email is unique
      match: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/, // Email format validation
    },
    password: {
      type: String,
      required: true,
      minlength: 6, // Password must be at least 6 characters long
    },
    isAdmin: {
      type: Boolean,
      default: false, // Default to false unless specified
    },
  },
  { timestamps: true } // Automatically create createdAt and updatedAt fields
);

// Hash the password before saving the user
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next(); // Skip hashing if the password has not been modified
  }

  try {
    // Generate a salt to hash the password
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt); // Hash the password
    next();
  } catch (err) {
    console.error("Password hashing error:", err);
    next(err); // Pass error to next middleware
  }
});

// Compare the entered password with the hashed password
userSchema.methods.comparePassword = async function (enteredPassword) {
  try {
    const isMatch = await bcrypt.compare(enteredPassword, this.password); // Compare password
    return isMatch;
  } catch (err) {
    console.error("Password comparison error:", err);
    return false;
  }
};

// Create the User model using the defined schema
const User = mongoose.model("User", userSchema);

module.exports = User;
