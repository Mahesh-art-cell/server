

// import jwt from "jsonwebtoken";
// import dotenv from "dotenv";
// dotenv.config();

// export const verifyToken = (req, res, next) => {
//   console.log("🔹 Incoming Cookies:", req.cookies);
//   console.log("🔹 Incoming Headers:", req.headers);

//   // Extract token from cookies or header
//   let token = req.cookies.accessToken || req.headers.authorization?.split(" ")[1];
//   console.log("🔹 Extracted Token:", token);

//   if (!token) {
//     console.error("❌ No Token Found!");
//     return res.status(401).json("Unauthorized: No token provided!");
//   }

//   jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
//     if (err) {
//       console.error("❌ Token Verification Failed:", err);
//       return res.status(403).json("Token is not valid!");
//     }

//     console.log("✅ Token Verified, User:", user);
//     req.user = user;
//     next();
//   });
// };



import jwt from "jsonwebtoken";

// ✅ Middleware to Verify Token
export const verifyToken = (req, res, next) => {
  // 🔹 Extract Token from Cookie or Authorization Header
  const token =
    req.cookies?.accessToken || // ✅ Check from cookies
    (req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer") &&
      req.headers.authorization.split(" ")[1]); // ✅ Extract from Bearer token

  // 🔍 Debugging - Token Presence
  console.log(
    "🔹 Verifying token:",
    token ? `Token found: ${token}` : "No token provided"
  );

  // ❌ No Token Found
  if (!token) {
    console.error("❌ No token provided.");
    return res.status(401).json({ error: "Not authenticated!" });
  }

  try {
    // 🔒 Verify Token
    const userInfo = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ Successful Token Verification
    console.log(
      `✅ Token verified for user: ${userInfo.id}`,
      "Token Expires At:",
      new Date(userInfo.exp * 1000)
    );

    req.userInfo = userInfo; // ✅ Attach user info to request
    next(); // 🚀 Proceed to Controller
  } catch (err) {
    // ❗️ Handle Token Expiry
    if (err.name === "TokenExpiredError") {
      console.error("❌ Token has expired!");
      return res
        .status(403)
        .json({ error: "Token expired. Please login again." });
    }

    // ❗️ Handle Invalid Token
    console.error("❌ Token verification failed:", err.message);
    return res.status(403).json({ error: "Token is not valid!" });
  }
};
