
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

// ✅ Verify JWT Token
export const verifyToken = (req, res, next) => {
  const token =
    req.cookies?.accessToken || req.headers.authorization?.split(" ")[1];

  console.log(
    "🔹 Verifying token:",
    token ? `Token exists: ${token}` : "No token"
  );

  if (!token) {
    console.error("❌ No token provided");
    return res.status(401).json({ error: "Not authenticated!" });
  }

  try {
    const userInfo = jwt.verify(token, process.env.JWT_SECRET);
    console.log(
      "✅ Token verified for user:",
      userInfo.id,
      "Token Expires At:",
      new Date(userInfo.exp * 1000)
    );

    req.userInfo = userInfo; // ✅ Add user info to request
    next(); // Proceed to controller
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      console.error("❌ Token has expired!");
      return res.status(403).json({ error: "Token expired. Please login again." });
    }
    console.error("❌ Token verification failed:", err.message);
    return res.status(403).json({ error: "Token is not valid!" });
  }
};

