

// middleware/verifyToken.js

import jwt from "jsonwebtoken";

// ✅ JWT Authentication Middleware
export const verifyToken = (req, res, next) => {
  // Extract token from cookies or Authorization header
  const token =
    req.cookies?.accessToken || req.headers.authorization?.split(" ")[1];

  console.log("🔹 Verifying token:", token || "No token found");

  if (!token) {
    return res.status(401).json({ error: "Not authenticated!" });
  }

  try {
    // ✅ Verify Token
    const userInfo = jwt.verify(token, process.env.JWT_SECRET);

    console.log(
      "✅ Token verified for user:",
      userInfo.id,
      "| Expires:",
      new Date(userInfo.exp * 1000).toLocaleString()
    );

    // ✅ Attach user info to request
    req.userInfo = userInfo;
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      console.error("❌ Token expired:", err.message);
      return res
        .status(403)
        .json({ error: "Token expired. Please login again." });
    }

    console.error("❌ Invalid token:", err.message);
    return res.status(403).json({ error: "Invalid token!" });
  }
};
