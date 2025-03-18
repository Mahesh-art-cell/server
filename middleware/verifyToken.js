

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

export const verifyToken = (req, res, next) => {
  // Get token from cookies or authorization header
  const token = req.cookies?.accessToken || req.headers.authorization?.split(" ")[1];
  
  console.log("🔹 Verifying token:", token ? "Token exists" : "No token");
  
  if (!token) {
    console.error("❌ No token provided");
    return res.status(401).json("Not authenticated!");
  }
  
  try {
    const userInfo = jwt.verify(token, process.env.JWT_SECRET);
    console.log("✅ Token verified for user:", userInfo.id);
    
    // Add userInfo to request object for use in controller
    req.userInfo = userInfo;
    next();
  } catch (err) {
    console.error("❌ Token verification failed:", err.message);
    return res.status(403).json("Token is not valid!");
  }
};