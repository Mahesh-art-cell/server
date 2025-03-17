// import jwt from "jsonwebtoken";
// import dotenv from "dotenv";
// dotenv.config();


// export const verifyToken = (req, res, next) => {
//   const token = req.cookies.accessToken; // ✅ Read token from cookies
//   if (!token) return res.status(401).json("Not authenticated!");

//   jwt.verify(token, process.env.JWT_SECRET, (err, userInfo) => {
//     if (err) return res.status(403).json("Token is not valid!");
//     req.user = userInfo;
//     next();
//   });
// };


import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const verifyToken = (req, res, next) => {
  console.log("🔹 Incoming Cookies:", req.cookies); // Debugging

  let token = req.cookies.accessToken || req.headers.authorization?.split(" ")[1];

  console.log("🔹 Extracted Token:", token); // Check if token is available

  if (!token) {
    console.error("❌ No Token Found!");
    return res.status(401).json("Unauthorized: No token provided!");
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      console.error("❌ Token Verification Failed:", err);
      return res.status(403).json("Token is not valid!");
    }
    
    console.log("✅ Token Verified, User:", user);
    req.user = user;
    next();
  });
};


