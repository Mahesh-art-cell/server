import { db } from "../connect.js";
import jwt from "jsonwebtoken";
import moment from "moment";
import dotenv from "dotenv";

// ✅ Load environment variables
dotenv.config();

// ✅ Use secretKey from environment
const secretKey = process.env.JWT_SECRET;

// ✅ Check if secretKey is loaded properly
if (!secretKey) {
  console.error("❌ JWT_SECRET is not defined. Check your .env file!");
}

// ✅ Get Comments (for a specific post)
export const getComments = (req, res) => {
  const q = `
    SELECT c.*, u.id AS userId, u.name, u.profilePic 
    FROM comments AS c 
    JOIN users AS u ON u.id = c.userId
    WHERE c.postId = ? 
    ORDER BY c.createdAt DESC
  `;

  db.query(q, [req.query.postId], (err, data) => {
    if (err) {
      console.error("❌ Error fetching comments:", err);
      return res.status(500).json(err);
    }
    return res.status(200).json(data);
  });
};

// ✅ Add a Comment (requires authentication)
export const addComment = (req, res) => {
  console.log("📥 Received request at /api/comments with body:", req.body);

  const token = req.cookies.accessToken;
  if (!token) {
    console.log("❌ No token found");
    return res.status(401).json("Not logged in!");
  }

  // ✅ Verify JWT Token Correctly
  jwt.verify(token, secretKey, (err, userInfo) => {
    if (err) {
      console.log("❌ Invalid token:", err.message);
      return res.status(403).json("Token is not valid!");
    }

    // ✅ Extract required fields
    const description = req.body.desc?.trim();
    const postId = req.body.postId;

    if (!description || !postId) {
      console.log("❌ Missing required fields");
      return res.status(400).json("Description and Post ID are required!");
    }

    // 🔍 Step 1: Check if the post exists
    const checkPostQuery = "SELECT id FROM posts WHERE id = ?";
    db.query(checkPostQuery, [postId], (err, postData) => {
      if (err) {
        console.log("❌ Error checking post existence:", err);
        return res.status(500).json(err);
      }
      if (postData.length === 0) {
        console.log("❌ Post with ID", postId, "does not exist!");
        return res.status(400).json("Post does not exist!");
      }

      // ✅ Step 2: Insert comment with correct userId
      const q = "INSERT INTO comments(`description`, `createdAt`, `userId`, `postId`) VALUES (?)";
      const values = [
        description,
        moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
        userInfo.id, // ✅ Get userId from token
        postId,
      ];

      db.query(q, [values], (err, data) => {
        if (err) {
          console.log("❌ Database error:", err);
          return res.status(500).json(err);
        }
        console.log("✅ Comment successfully inserted:", data);
        return res.status(200).json("Comment has been created.");
      });
    });
  });
};

// ✅ Delete a Comment (only owner can delete)
export const deleteComment = (req, res) => {
  console.log("📥 Delete request received for comment ID:", req.params.id);

  const token = req.cookies.accessToken;
  if (!token) {
    console.log("❌ No token found in request");
    return res.status(401).json("Not authenticated!");
  }

  // ✅ Verify Token and Get userId
  jwt.verify(token, secretKey, (err, userInfo) => {
    if (err) {
      console.log("❌ Invalid token:", err.message);
      return res.status(403).json("Token is not valid!");
    }

    const commentId = req.params.id;

    // 🔍 Step 1: Check if the comment exists and belongs to the user
    const checkCommentQuery = "SELECT userId FROM comments WHERE id = ?";
    db.query(checkCommentQuery, [commentId], (err, result) => {
      if (err) {
        console.log("❌ Database error:", err);
        return res.status(500).json(err);
      }

      if (result.length === 0) {
        console.log("❌ Comment not found!");
        return res.status(404).json("Comment not found!");
      }

      if (result[0].userId !== userInfo.id) {
        console.log("❌ Unauthorized attempt to delete comment");
        return res.status(403).json("You can only delete your own comment!");
      }

      // ✅ Step 2: Delete the comment
      const deleteQuery = "DELETE FROM comments WHERE id = ?";
      db.query(deleteQuery, [commentId], (err, data) => {
        if (err) {
          console.log("❌ Error deleting comment:", err);
          return res.status(500).json(err);
        }

        console.log("✅ Comment deleted successfully!");
        return res.status(200).json("Comment deleted.");
      });
    });
  });
};
