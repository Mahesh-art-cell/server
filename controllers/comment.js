import Comment from "../models/Comment.js";
import Post from "../models/Post.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
const secretKey = process.env.JWT_SECRET;

if (!secretKey) {
  console.error("❌ JWT_SECRET is not defined. Check your .env file!");
}

// Get Comments (for a specific post)
export const getComments = async (req, res) => {
  try {
    const postId = req.query.postId;
    if (!postId) return res.status(400).json({ error: "postId query param required" });

    // Find comments for the post and populate user details
    const comments = await Comment.find({ postId })
      .populate("userId", "name profilePic")
      .sort({ createdAt: -1 });
    console.log(comments)
    res.status(200).json(comments);
  } catch (err) {
    console.error("❌ Error fetching comments:", err);
    res.status(500).json({ error: err.message });
  }
};

// Add a Comment (requires auth)
export const addComment = async (req, res) => {
  try {
    const token = req.cookies.accessToken || req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json("Not logged in!");

    const userInfo = jwt.verify(token, secretKey);

    const { desc, postId } = req.body;
    if (!desc?.trim() || !postId) return res.status(400).json("Description and Post ID are required!");

    // Check if post exists
    const postExists = await Post.findById(postId);
    if (!postExists) return res.status(400).json("Post does not exist!");

    // Create comment
    const newComment = new Comment({
      description: desc.trim(),
      createdAt: new Date(),
      userId: userInfo.id,
      postId,
    });

    console.log(newComment)
    await newComment.save();

    res.status(200).json("Comment has been created.");
  } catch (err) {
    console.error("❌ Error adding comment:", err);
    res.status(500).json({ error: err.message });
  }
};

// Delete a Comment (only owner can delete)
export const deleteComment = async (req, res) => {
  console.log("🗑️ DELETE Comment API Hit");

  try {
    // ✅ Extract Token
    const token = req.cookies.accessToken || req.headers.authorization?.split(" ")[1];
    console.log("🔑 Token Received:", token);

    if (!token) {
      console.log("❌ No token found in request");
      return res.status(401).json("Not authenticated!");
    }

    // ✅ Verify JWT Token
    const userInfo = jwt.verify(token, secretKey);
    console.log("✅ Token Verified:", userInfo);

    // ✅ Extract Comment ID from params
    const commentId = req.params.id;
    console.log("🆔 Comment ID from params:", commentId);

    if (!commentId) {
      console.log("❌ No Comment ID provided in URL");
      return res.status(400).json("Comment ID is required!");
    }

    // ✅ Find the comment by ID
    const comment = await Comment.findById(commentId);
    console.log("📦 Fetched Comment from DB:", comment);

    if (!comment) {
      console.log("❌ Comment not found in database");
      return res.status(404).json("Comment not found!");
    }

    // ✅ Check ownership
    if (comment.userId.toString() !== userInfo.id) {
      console.log(`❌ Unauthorized delete attempt by user ${userInfo.id}`);
      return res.status(403).json("You can only delete your own comment!");
    }

    // ✅ Delete comment
    await Comment.findByIdAndDelete(commentId);
    console.log("✅ Comment deleted successfully");

    res.status(200).json("Comment deleted.");
  } catch (err) {
    console.error("❌ Error during deleteComment:", err);
    res.status(500).json({ error: err.message });
  }
};