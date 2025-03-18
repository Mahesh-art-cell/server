


import { db } from "../connect.js";
import jwt from "jsonwebtoken";

export const getUser = (req, res) => {
  const userId = req.params.userId;
  const q = "SELECT * FROM users WHERE id=?";

  db.query(q, [userId], (err, data) => {
    if (err) return res.status(500).json(err);

    if (data.length === 0) return res.status(404).json("User not found!");

    const { password, ...info } = data[0];
    return res.json(info);
  });
};




export const updateUser = (req, res) => {
  console.log("🔹 Received Headers:", req.headers);
  console.log("🔹 Received Cookies:", req.cookies);

  const token = req.cookies.accessToken || req.headers.authorization?.split(" ")[1];
  console.log("🔹 Extracted Token:", token);

  if (!token) {
    console.error("❌ No Token Provided!");
    return res.status(401).json("Unauthorized: No token provided!");
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, userInfo) => {
    if (err) {
      console.error("❌ Token verification failed:", err);
      return res.status(403).json("Token is not valid!");
    }

    console.log("✅ Token Verified, User Info:", userInfo);

    // ✅ Proceed with update logic
    const q = "UPDATE users SET `name`=?, `email`=?, `username`=?, `coverPic`=?, `profilePic`=? WHERE id=?";

    const values = [
      req.body.name,
      req.body.email,
      req.body.username,
      req.body.coverPic,
      req.body.profilePic,
      req.params.userId,
    ];

    db.query(q, values, (err, data) => {
      if (err) {
        console.error("❌ Error Updating User:", err);
        return res.status(500).json(err);
      }
      console.log("✅ User updated successfully!");
      res.status(200).json("User updated successfully!");
    });
  });
};
