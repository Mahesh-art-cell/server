

// import { db } from "../connect.js";
// import jwt from "jsonwebtoken";
// import dotenv from "dotenv";

// // ✅ Load environment variables
// dotenv.config();

// // ✅ Use secretKey from environment
// const secretKey = process.env.JWT_SECRET;

// // ✅ Check if secretKey is loaded properly
// if (!secretKey) {
//   console.error("❌ JWT_SECRET is not defined. Check your .env file!");
// }

// // ✅ Get Likes
// export const getLikes = (req, res) => {
//   console.log("✅ getLikes API Hit!");
//   const q = "SELECT userId FROM likes WHERE postId = ?";

//   // ✅ Debug postId received in query
//   console.log("🔍 postId received:", req.query.postId);

//   db.query(q, [req.query.postId], (err, data) => {
//     if (err) {
//       console.error("❌ Error fetching likes:", err);
//       return res.status(500).json(err);
//     }
//     console.log("✅ Likes fetched successfully:", data);
//     return res.status(200).json(data.map((like) => like.userId));
//   });
// };

// // ✅ Add Like to Post
// export const addLike = (req, res) => {
//   console.log("✅ addLike API Hit!");
//   console.log("🔍 Cookies Received:", req.cookies); // ✅ Log All Cookies
//   const token = req.cookies.accessToken;

//   if (!token) {
//     console.log("❌ No Token Found!");
//     return res.status(401).json("Not logged in!");
//   }

//   console.log("✅ Token Received:", token);

//   // ✅ Verify JWT Token Correctly
//   jwt.verify(token, secretKey, (err, userInfo) => {
//     if (err) {
//       console.error("❌ Token Verification Failed:", err.message);
//       return res.status(403).json("Token is not valid!");
//     }

//     console.log("✅ Token Verified:", userInfo);

//     // ✅ Check if postId is provided
//     const { postId } = req.body;
//     console.log("🔍 postId received:", postId);

//     if (!postId) {
//       console.log("❌ Missing postId!");
//       return res.status(400).json({ error: "postId is required!" });
//     }

//     // ✅ Add like using userId from JWT and postId from request body
//     const q = "INSERT INTO likes (`userId`, `postId`) VALUES (?, ?)";
//     const values = [userInfo.id, postId];

//     console.log("✅ Adding like with values:", values);
//     db.query(q, values, (err, data) => {
//       if (err) {
//         console.error("❌ Error adding like:", err);
//         return res.status(500).json(err);
//       }
//       console.log("✅ Like added successfully!");
//       return res.status(200).json("Post has been liked.");
//     });
//   });
// };

// // ✅ Delete Like from Post
// export const deleteLike = (req, res) => {
//   console.log("✅ deleteLike API Hit!");
//   const token = req.cookies.accessToken;
//   console.log("🔍 Token Received:", token);

//   if (!token) {
//     console.log("❌ No Token Found!");
//     return res.status(401).json("Not logged in!");
//   }

//   // ✅ Verify Token and Get userId
//   jwt.verify(token, secretKey, (err, userInfo) => {
//     if (err) {
//       console.log("❌ Token Verification Failed:", err.message);
//       return res.status(403).json("Token is not valid!");
//     }

//     console.log("✅ Token Verified:", userInfo);

//     // ✅ Debug postId received in query
//     console.log("🔍 postId received:", req.query.postId);

//     if (!userInfo || !userInfo.id) {
//       console.log("❌ Invalid Token Structure! User ID not found.");
//       return res.status(403).json("Invalid token data!");
//     }

//     // ✅ Delete like with correct userId and postId
//     const q = "DELETE FROM likes WHERE `userId` = ? AND `postId` = ?";
//     const values = [userInfo.id, req.query.postId];

//     console.log("✅ Deleting like with values:", values);
//     db.query(q, values, (err, data) => {
//       if (err) {
//         console.error("❌ Error deleting like:", err);
//         return res.status(500).json(err);
//       }
//       console.log("✅ Like deleted successfully!");
//       return res.status(200).json("Post has been disliked.");
//     });
//   });
// };




import jwt from "jsonwebtoken";
import Like from "../models/Like.js";
import dotenv from "dotenv";

dotenv.config();
const secretKey = process.env.JWT_SECRET;

// ✅ Get Likes for a post
export const getLikes = async (req, res) => {
  try {
    const { postId } = req.query;
    console.log(req.query)
    if (!postId) return res.status(400).json("postId is required");

    const likes = await Like.find({ postId }).select("userId");
    const userIds = likes.map(like => like.userId);
    res.status(200).json(userIds);
  } catch (err) {
    res.status(500).json({ error: "Error fetching likes", message: err.message });
  }
};

// ✅ Add Like
export const addLike = async (req, res) => {
  const token = req.cookies.accessToken || req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json("Not logged in");

  try {
    const userInfo = jwt.verify(token, secretKey);
    const { postId } = req.body;

    if (!postId) return res.status(400).json("postId is required");

    const alreadyLiked = await Like.findOne({ userId: userInfo.id, postId });
    if (alreadyLiked) return res.status(400).json("Post already liked");

    const newLike = new Like({ userId: userInfo.id, postId });
    await newLike.save();
    res.status(200).json("Post has been liked");
  } catch (err) {
    res.status(403).json({ error: "Token error", message: err.message });
  }
};

// ✅ Delete Like
export const deleteLike = async (req, res) => {
  const token = req.cookies.accessToken || req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json("Not logged in");

  try {
    const userInfo = jwt.verify(token, secretKey);
    const { postId } = req.query;

    if (!postId) return res.status(400).json("postId is required");

    const deleted = await Like.findOneAndDelete({ userId: userInfo.id, postId });
    if (!deleted) return res.status(404).json("Like not found");

    res.status(200).json("Post has been disliked");
  } catch (err) {
    res.status(403).json({ error: "Token error", message: err.message });
  }
};
