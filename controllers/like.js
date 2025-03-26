// import { db } from "../connect.js";
// import jwt from "jsonwebtoken";

// export const getLikes = (req,res)=>{
//     const q = "SELECT userId FROM likes WHERE postId = ?";

//     db.query(q, [req.query.postId], (err, data) => {
//       if (err) return res.status(500).json(err);
//       return res.status(200).json(data.map(like=>like.userId));
//     });
// }

// export const addLike = (req, res) => {
//   const token = req.cookies.accessToken;
//   if (!token) return res.status(401).json("Not logged in!");

//   jwt.verify(token, "secretkey", (err, userInfo) => {
//     if (err) return res.status(403).json("Token is not valid!");

//     const q = "INSERT INTO likes (`userId`,`postId`) VALUES (?)";
//     const values = [
//       userInfo.id,
//       req.body.postId
//     ];
    
//     db.query(q, [values], (err, data) => {
//       if (err) return res.status(500).json(err);
//       return res.status(200).json("Post has been liked.");
//     });
//   });
// };

// export const deleteLike = (req, res) => {
//   const token = req.cookies.accessToken;
//   console.log("🔍 Token Received:", token); // Debug log

//   if (!token) return res.status(401).json("Not logged in!");

//   jwt.verify(token, "secretkey", (err, userInfo) => {
//     if (err) {
//       console.log("❌ Token Verification Failed:", err.message);
//       return res.status(403).json("Token is not valid!");
//     }

//     console.log("✅ Token Verified:", userInfo);
//     const q = "DELETE FROM likes WHERE `userId` = ? AND `postId` = ?";

//     db.query(q, [userInfo.id, req.query.postId], (err, data) => {
//       if (err) return res.status(500).json(err);
//       return res.status(200).json("Post has been disliked.");
//     });
//   });
// };





import { db } from "../connect.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

// ✅ Load environment variables
dotenv.config();

// ✅ Use secretKey from environment
const secretKey = process.env.JWT_SECRET;

// ✅ Check if secretKey is loaded properly
if (!secretKey) {
  console.error("❌ JWT_SECRET is not defined. Check your .env file!");
}

// ✅ Get Likes
export const getLikes = (req, res) => {
  console.log("✅ getLikes API Hit!");
  const q = "SELECT userId FROM likes WHERE postId = ?";

  // ✅ Debug postId received in query
  console.log("🔍 postId received:", req.query.postId);

  db.query(q, [req.query.postId], (err, data) => {
    if (err) {
      console.error("❌ Error fetching likes:", err);
      return res.status(500).json(err);
    }
    console.log("✅ Likes fetched successfully:", data);
    return res.status(200).json(data.map((like) => like.userId));
  });
};

// ✅ Add Like to Post
export const addLike = (req, res) => {
  console.log("✅ addLike API Hit!");
  console.log("🔍 Cookies Received:", req.cookies); // ✅ Log All Cookies
  const token = req.cookies.accessToken;

  if (!token) {
    console.log("❌ No Token Found!");
    return res.status(401).json("Not logged in!");
  }

  console.log("✅ Token Received:", token);

  // ✅ Verify JWT Token Correctly
  jwt.verify(token, secretKey, (err, userInfo) => {
    if (err) {
      console.error("❌ Token Verification Failed:", err.message);
      return res.status(403).json("Token is not valid!");
    }

    console.log("✅ Token Verified:", userInfo);

    // ✅ Check if postId is provided
    const { postId } = req.body;
    console.log("🔍 postId received:", postId);

    if (!postId) {
      console.log("❌ Missing postId!");
      return res.status(400).json({ error: "postId is required!" });
    }

    // ✅ Add like using userId from JWT and postId from request body
    const q = "INSERT INTO likes (`userId`, `postId`) VALUES (?, ?)";
    const values = [userInfo.id, postId];

    console.log("✅ Adding like with values:", values);
    db.query(q, values, (err, data) => {
      if (err) {
        console.error("❌ Error adding like:", err);
        return res.status(500).json(err);
      }
      console.log("✅ Like added successfully!");
      return res.status(200).json("Post has been liked.");
    });
  });
};

// ✅ Delete Like from Post
export const deleteLike = (req, res) => {
  console.log("✅ deleteLike API Hit!");
  const token = req.cookies.accessToken;
  console.log("🔍 Token Received:", token);

  if (!token) {
    console.log("❌ No Token Found!");
    return res.status(401).json("Not logged in!");
  }

  // ✅ Verify Token and Get userId
  jwt.verify(token, secretKey, (err, userInfo) => {
    if (err) {
      console.log("❌ Token Verification Failed:", err.message);
      return res.status(403).json("Token is not valid!");
    }

    console.log("✅ Token Verified:", userInfo);

    // ✅ Debug postId received in query
    console.log("🔍 postId received:", req.query.postId);

    if (!userInfo || !userInfo.id) {
      console.log("❌ Invalid Token Structure! User ID not found.");
      return res.status(403).json("Invalid token data!");
    }

    // ✅ Delete like with correct userId and postId
    const q = "DELETE FROM likes WHERE `userId` = ? AND `postId` = ?";
    const values = [userInfo.id, req.query.postId];

    console.log("✅ Deleting like with values:", values);
    db.query(q, values, (err, data) => {
      if (err) {
        console.error("❌ Error deleting like:", err);
        return res.status(500).json(err);
      }
      console.log("✅ Like deleted successfully!");
      return res.status(200).json("Post has been disliked.");
    });
  });
};
