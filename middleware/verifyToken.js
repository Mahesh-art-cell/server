

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



// import jwt from "jsonwebtoken";

// export const verifyToken = (req, res, next) => {
//   const token =
//     req.cookies?.accessToken || req.headers.authorization?.split(" ")[1]; // ✅ Get token from cookie or header

//   console.log(
//     "🔹 Verifying token:",
//     token ? `Token exists: ${token}` : "No token"
//   );

//   if (!token) {
//     console.error("❌ No token provided");
//     return res.status(401).json({ error: "Not authenticated!" });
//   }

//   try {
//     const userInfo = jwt.verify(token, process.env.JWT_SECRET);
//     console.log(
//       "✅ Token verified for user:",
//       userInfo.id,
//       "Token Expires At:",
//       new Date(userInfo.exp * 1000)
//     );

//     req.userInfo = userInfo; // ✅ Add user info to request
//     next(); // Proceed to controller
//   } catch (err) {
//     if (err.name === "TokenExpiredError") {
//       console.error("❌ Token has expired!");
//       return res.status(403).json({ error: "Token expired. Please login again." });
//     }
//     console.error("❌ Token verification failed:", err.message);
//     return res.status(403).json({ error: "Token is not valid!" });
//   }
// };



import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // ✅ Extract token

  if (!token) {
    console.log("❌ No token provided!");
    return res.status(401).json({ error: "Unauthorized! No token provided." });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      console.error("❌ Token verification failed:", err.message);
      return res.status(403).json({ error: "Invalid or expired token." });
    }

    req.user = user; // ✅ Attach user to request
    next();
  });
};
