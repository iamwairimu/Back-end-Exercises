import jwt from "jsonwebtoken";
import "dotenv/config"; // Make sure to load environment variables

// authenticate token
export const authenticateToken = (req, res, next) => {
  // Get the token from the header
  const authHeader = req.headers["authorization"];

  // Check if authorization header exists and is in the correct format
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      error: "Unauthorized: No token provided or invalid format",
    });
  }

  // Extract the token
  const token = authHeader.substring(7); // Remove "Bearer " prefix

  if (!token) {
    return res.status(401).json({
      error: "Unauthorized: No token provided",
    });
  }

  // Verify the token
  jwt.verify(
    token,
    process.env.JWT_SECRET || "my_secret_key254",
    (err, user) => {
      if (err) {
        console.error("JWT Verification Error:", err);
        return res.status(403).json({
          error: "Forbidden: Invalid or expired token",
        });
      }

      // Add the user to the request object
      req.user = user;
      next();
    }
  );
};
