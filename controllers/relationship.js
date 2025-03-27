import { db } from "../connect.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

// ✅ Get Relationships (Get Followers of a User)
export const getRelationships = (req, res) => {
  console.log("📢 Incoming request:", req.query);

  if (!req.query.followedUserId) {
    console.error("❌ Missing followedUserId");
    return res.status(400).json("followedUserId is required");
  }

  const q = "SELECT followerUserId FROM relationships WHERE followedUserId = ?";
  console.log("📌 Running Query:", q, "With Value:", req.query.followedUserId);

  db.query(q, [req.query.followedUserId], (err, data) => {
    if (err) {
      console.error("❌ MySQL Error:", err);
      return res.status(500).json(err);
    }

    console.log("✅ Query Result:", data);
    return res.status(200).json(data.map((relationship) => relationship.followerUserId));
  });
};

// ✅ Add Relationship (Follow a User)
export const addRelationship = (req, res) => {
  console.log("📢 Incoming request:", req.body);
  console.log("📢 Cookies received:", req.cookies);

  const token = req.cookies.accessToken;
  if (!token) {
    console.error("❌ No token found");
    return res.status(401).json("Not logged in!");
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, userInfo) => {
    if (err) {
      console.error("❌ Invalid token:", err);
      return res.status(403).json("Token is not valid!");
    }

    console.log("✅ Authenticated User ID:", userInfo.id);

    if (!req.body.followedUserId) {
      console.error("❌ Missing followedUserId in request body");
      return res.status(400).json("followedUserId is required");
    }

    const q = "INSERT INTO relationships (`followerUserId`, `followedUserId`) VALUES (?, ?)";
    const values = [userInfo.id, req.body.followedUserId];

    console.log("📌 Executing SQL:", q, "Values:", values);

    db.query(q, values, (err, data) => {
      if (err) {
        console.error("❌ MySQL Error:", err);
        return res.status(500).json(err);
      }
      console.log("✅ Insert Successful:", data);
      return res.status(200).json("Following");
    });
  });
};

// ✅ Delete Relationship (Unfollow a User)
export const deleteRelationship = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) {
    console.error("❌ No token found");
    return res.status(401).json("Not logged in!");
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, userInfo) => {
    if (err) {
      console.error("❌ Invalid token:", err);
      return res.status(403).json("Token is not valid!");
    }

    console.log("✅ Authenticated User ID:", userInfo.id);

    const q = "DELETE FROM relationships WHERE `followerUserId` = ? AND `followedUserId` = ?";
    db.query(q, [userInfo.id, req.query.userId], (err, data) => {
      if (err) {
        console.error("❌ MySQL Error:", err);
        return res.status(500).json(err);
      }
      console.log("✅ Unfollowed Successfully:", data);
      return res.status(200).json("Unfollow");
    });
  });
};



export const getSuggestions = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) {
    return res.status(401).json("Not logged in!");
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const q = `
      SELECT id, username, profilePic
      FROM users
      WHERE id != ? AND id NOT IN (
        SELECT followedUserId FROM relationships WHERE followerUserId = ?
      )
    `;

    db.query(q, [userInfo.id, userInfo.id], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json(data);
    });
  });
};