const jwt = require("jsonwebtoken");
const User = require("../models/user"); // User model to fetch user details from DB

// Middleware to check if the user is authenticated
const authMiddleware = async (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    // Remove "Bearer " from token if present
    const jwtToken = token.startsWith("Bearer ") ? token.slice(7) : token;

    // Verify the JWT token
    const decoded = jwt.verify(jwtToken, process.env.JWT_SECRET); // JWT_SECRET is the secret key

    // Attach the user information to the request object
    req.user = await User.findById(decoded.userId).select("-password"); // Exclude the password from the response

    next(); // Proceed to the next middleware or route handler
  } catch (err) {
    console.error("Authentication error:", err);
    res.status(401).json({ message: "Token is not valid" });
  }
};

module.exports = { authMiddleware };
